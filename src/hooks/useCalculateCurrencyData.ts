import { useRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { getCurrentExchangeRateQuery } from './api/ExchangeRate/useGetCurrentExchangeRate'
import type { FeeType } from '@/types/locationFee'

// Types
export type AssetClass = 'FIAT' | 'CRYPTO'

export interface Asset {
  label: string
  value: string
  class: AssetClass
}

export interface UseExchangeCalculatorConfig {
  initialAssetFrom: Asset
  initialAssetTo: Asset
  initialExchangeRate: number
}

export interface UseExchangeCalculatorReturn {
  assetFrom: Asset
  setAssetFrom: (asset: Asset) => void
  assetTo: Asset
  setAssetTo: (asset: Asset) => void
  amountFrom: string
  setAmountFrom: (amount: string) => void
  amountTo: string
  setAmountTo: (amount: string) => void
  feeType: FeeType
  setFeeType: (type: FeeType) => void
  feeValue: string
  setFeeValue: (value: string) => void
  exchangeRate: number
  calculatedFee: number
  handleSwapAssets: () => Promise<void>
}

/**
 * React hook for managing fiat-crypto exchange calculations
 * Supports bi-directional conversion with automatic fee application
 */
export const useExchangeCalculator = (
  config: UseExchangeCalculatorConfig,
): UseExchangeCalculatorReturn => {
  const queryClient = useQueryClient()

  // Asset configurations
  const [assetFrom, setAssetFromState] = useState<Asset>(
    config.initialAssetFrom,
  )

  const [assetTo, setAssetToState] = useState<Asset>(config.initialAssetTo)

  // Amount inputs (stored as strings to avoid cursor jumping)
  const [amountFrom, setAmountFromState] = useState<string>('0')
  const [amountTo, setAmountToState] = useState<string>('0')

  // Fee configuration
  const [feeType, setFeeTypeState] = useState<FeeType>('PCT')
  const [feeValue, setFeeValueState] = useState<string>('10')

  // Exchange rate (constant for now)
  const [exchangeRate, setExchangeRate] = useState<number>(
    config.initialExchangeRate,
  )

  // Calculated results
  const [calculatedFee, setCalculatedFee] = useState<number>(0)

  // Track which field was last edited to determine calculation direction
  const lastEditedRef = useRef<'from' | 'to'>('from')

  /**
   * Get decimal precision based on asset class
   */
  const getPrecision = (assetClass: AssetClass): number => {
    return assetClass === 'FIAT' ? 2 : 8
  }

  /**
   * Round to appropriate decimal places
   */
  const roundTo = (value: number, decimals: number): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }

  interface CalculateFeeConfig {
    amount: number
    feeTypeInput?: FeeType
    feeValueInput?: string
  }
  /**
   * Calculate fee amount
   */
  const calculateFee = (feeConfigInput: CalculateFeeConfig): number => {
    const {
      amount,
      feeTypeInput = feeType,
      feeValueInput = feeValue,
    } = feeConfigInput
    if (feeTypeInput === 'PCT') {
      return amount * (parseFloat(feeValueInput) / 100)
    }
    return parseFloat(feeValueInput)
  }

  /**
   * Calculate amountTo based on amountFrom
   */

  interface ConfigCalculateForward {
    assetFromInput: Asset
    amountFromInput: string
    assetToInput?: Asset
    amountToInput?: string
    newExchangeRate?: number
    feeTypeInput?: FeeType
    feeValueInput?: string
  }

  const calculateForward = (
    configInput: ConfigCalculateForward,
  ): { result: number; fee: number } => {
    const {
      assetFromInput,
      amountFromInput,
      newExchangeRate = exchangeRate,
      feeTypeInput = feeType,
      feeValueInput = feeValue,
    } = configInput

    const amountFromNum = parseFloat(amountFromInput) || 0
    let netFrom = amountFromNum
    let rawTo = 0
    let finalTo = 0
    let fee = 0

    // If converting from FIAT, subtract fee first
    if (assetFromInput.class === 'FIAT') {
      fee = calculateFee({ amount: amountFromNum, feeTypeInput, feeValueInput })
      netFrom = amountFromNum - fee
      rawTo = netFrom * newExchangeRate
      finalTo = rawTo
    }
    // If converting from CRYPTO to FIAT, add fee after conversion
    else {
      rawTo = amountFromNum * newExchangeRate
      fee = calculateFee({ amount: rawTo, feeTypeInput, feeValueInput })
      console.log('rawTo', {
        rawTo,
        feeTypeInput,
        feeValueInput,
        fee,
        newExchangeRate,
      })
      finalTo = rawTo - fee
    }

    const precision = getPrecision(assetTo.class)
    const feePrecision = 2 // Fee is always in FIAT, so 2 decimals

    return {
      result: roundTo(Math.max(0, finalTo), precision),
      fee: roundTo(fee, feePrecision),
    }
  }

  interface ConfigCalculateBackward {
    assetFromInput?: Asset
    amountFromInput?: string
    assetToInput: Asset
    amountToInput: string
    newExchangeRate?: number
    feeTypeInput?: FeeType
    feeValueInput?: string
  }

  /**
   * Calculate amountFrom based on amountTo (inverse calculation)
   */
  const calculateBackward = (
    backConfigInput: ConfigCalculateBackward,
  ): { result: number; fee: number } => {
    const {
      assetToInput,
      amountToInput,
      newExchangeRate = exchangeRate,
      feeTypeInput = feeType,
      feeValueInput = feeValue,
    } = backConfigInput

    const amountToNum = parseFloat(amountToInput) || 0
    let rawFrom = 0
    let finalFrom = 0
    let fee = 0

    // If converting to FIAT, we need to account for fee that was subtracted
    if (assetToInput.class !== 'CRYPTO') {
      // amountTo = (amountFrom * rate) - fee
      // We need to find amountFrom such that this equation holds

      if (feeType === 'PCT') {
        // amountTo = (amountFrom * rate) - (amountFrom * rate * feeValue/100)
        // amountTo = (amountFrom * rate) * (1 - feeValue/100)
        // amountFrom = amountTo / (rate * (1 - feeValue/100))
        const multiplier = 1 - parseInt(feeValue) / 100
        rawFrom = amountToNum / (newExchangeRate * multiplier)
        const rawTo = rawFrom * newExchangeRate
        fee = calculateFee({ amount: rawTo, feeTypeInput, feeValueInput })
      } else {
        // amountTo = (amountFrom * rate) - feeValue
        // amountFrom * rate = amountTo + feeValue
        // amountFrom = (amountTo + feeValue) / rate
        fee = parseInt(feeValue)
        rawFrom = (amountToNum + fee) / newExchangeRate
      }
      finalFrom = rawFrom
    }
    // If converting from FIAT, fee was subtracted before conversion
    else {
      // amountTo = (amountFrom - fee) * rate
      // amountFrom - fee = amountTo / rate
      // amountFrom = (amountTo / rate) + fee

      const netFrom = amountToNum / newExchangeRate

      if (feeType === 'PCT') {
        // netFrom = amountFrom - (amountFrom * feeValue/100)
        // netFrom = amountFrom * (1 - feeValue/100)
        // amountFrom = netFrom / (1 - feeValue/100)
        const multiplier = 1 - parseInt(feeValue) / 100
        finalFrom = netFrom / multiplier
        fee = calculateFee({ amount: finalFrom, feeTypeInput, feeValueInput })
      } else {
        // netFrom = amountFrom - feeValue
        // amountFrom = netFrom + feeValue
        fee = parseInt(feeValue)
        finalFrom = netFrom + fee
      }
    }
    // CRYPTO to CRYPTO or other cases

    const precision = getPrecision(assetFrom.class)
    const feePrecision = 2 // Fee is always in FIAT, so 2 decimals

    return {
      result: roundTo(Math.max(0, finalFrom), precision),
      fee: roundTo(fee, feePrecision),
    }
  }

  /**
   * Wrapped setters that track which field was edited
   */
  const setAmountFrom = (value: string): void => {
    lastEditedRef.current = 'from'
    const { result, fee } = calculateForward({
      assetFromInput: assetFrom,
      amountFromInput: value,
    })
    setAmountFromState(value)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  const setAmountTo = (value: string): void => {
    lastEditedRef.current = 'to'
    const { result, fee } = calculateBackward({
      assetToInput: assetTo,
      amountToInput: value,
    })
    setAmountFromState(result.toString())
    setAmountToState(value)
    setCalculatedFee(fee)
  }

  const setAssetFrom = async (asset: Asset): Promise<void> => {
    let rate = '0'

    try {
      if (asset.value !== assetTo.value) {
        const rateResp = await queryClient.ensureQueryData(
          getCurrentExchangeRateQuery({
            from_asset_id: asset.value,
            to_asset_id: assetTo.value,
          }),
        )
        rate = rateResp.rate
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }

    console.log('rate', rate)

    const { result, fee } = calculateForward({
      assetFromInput: asset,
      amountFromInput: amountFrom,
      newExchangeRate: parseFloat(rate),
    })
    setExchangeRate(parseFloat(rate))
    setAssetFromState(asset)
    setAmountFromState(amountFrom)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  const setAssetTo = async (asset: Asset): Promise<void> => {
    let rate = '0'

    try {
      if (asset.value !== assetFrom.value) {
        const rateResp = await queryClient.ensureQueryData(
          getCurrentExchangeRateQuery({
            from_asset_id: assetFrom.value,
            to_asset_id: asset.value,
          }),
        )
        rate = rateResp.rate
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }

    console.log('rate', rate)

    const { result, fee } = calculateForward({
      assetFromInput: assetFrom,
      amountFromInput: amountFrom,
      newExchangeRate: parseFloat(rate),
    })
    setExchangeRate(parseFloat(rate))
    setAssetToState(asset)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  const setFeeType = (type: FeeType): void => {
    const { result, fee } = calculateForward({
      assetFromInput: assetFrom,
      amountFromInput: amountFrom,
      feeTypeInput: type,
    })
    setFeeTypeState(type)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  const setFeeValue = (value: string): void => {
    const { result, fee } = calculateForward({
      assetFromInput: assetFrom,
      amountFromInput: amountFrom,
      feeValueInput: value,
    })
    setFeeValueState(value)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  const handleSwapAssets = async (): Promise<void> => {
    let rate = '0'
    
    try {
      if (assetTo.value !== assetFrom.value) {
        const rateResp = await queryClient.ensureQueryData(
          getCurrentExchangeRateQuery({
            from_asset_id: assetTo.value,
            to_asset_id: assetFrom.value,
          }),
        )
        rate = rateResp.rate
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }

    const { result, fee } = calculateForward({
      assetFromInput: assetTo,
      amountFromInput: amountTo,
      newExchangeRate: parseFloat(rate),
    })
    setExchangeRate(parseFloat(rate))
    setAssetFromState(assetTo)
    setAssetToState(assetFrom)
    setAmountFromState(amountTo)
    setAmountToState(result.toString())
    setCalculatedFee(fee)
  }

  return {
    // Asset configuration
    assetFrom,
    setAssetFrom,
    assetTo,
    setAssetTo,

    // Input amounts
    amountFrom,
    setAmountFrom,
    amountTo,
    setAmountTo,

    // Fee configuration
    feeType,
    setFeeType,
    feeValue,
    setFeeValue,

    // Exchange rate
    exchangeRate,

    // Calculated results
    calculatedFee,
    handleSwapAssets
  }
}
