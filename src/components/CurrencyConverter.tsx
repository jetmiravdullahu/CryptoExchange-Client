import { ArrowDownUp } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { SelectInput } from './ui/select'
import { ErrorMessages } from './FormComponents'
import type { IGetAssetOptionsResponseData } from '@/api/Asset/getAssetOptions'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { useGetCurrentExchangeRateSuspenseQuery } from '@/hooks/api/ExchangeRate/useGetCurrentExchangeRate'

interface TransactionValidationErrors {
  from_asset_id?: Array<string>
  to_asset_id?: Array<string>
}

export const CurrencyConverter = ({
  fromAmount,
  toAmount,
  fromAsset,
  toAsset,
  handleFromAssetChange,
  handleFromValueChange,
  handleToAssetChange,
  handleToValueChange,
  handleSwapAssets,
  errors,
  resetErrors,
}: {
  fromAsset: IGetAssetOptionsResponseData
  toAsset: IGetAssetOptionsResponseData
  fromAmount: string
  toAmount: string
  handleFromAssetChange: (asset: IGetAssetOptionsResponseData) => void
  handleFromValueChange: (value: string) => void
  handleToAssetChange: (asset: IGetAssetOptionsResponseData) => void
  handleToValueChange: (value: string) => void
  handleSwapAssets: () => Promise<void>
  errors: TransactionValidationErrors
  resetErrors: () => void
}) => {
  const { data: assetOptions } = useGetAssetOptions()
  const { data: currentExchangeRate } = useGetCurrentExchangeRateSuspenseQuery({
    from_asset_id: fromAsset.value,
    to_asset_id: toAsset.value,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="from-amount" className="text-sm font-medium">
          From
        </Label>
        <SelectInput
          label="Hey"
          options={assetOptions}
          value={fromAsset.value}
          onValueChange={(value) => {
            handleFromAssetChange(
              assetOptions.find((asset) => asset.value === value)!,
            )
            resetErrors()
          }}
          className="text-lg !h-12"
          placeholder="From Asset"
        />
        <div className="relative">
          <Input
            id="from-amount"
            type="number"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => {
              if (!currentExchangeRate.rate) return
              handleFromValueChange(e.target.value)
              resetErrors()
            }}
            disabled={!currentExchangeRate.rate}
            className="text-lg h-14 pr-16"
          />
          <ErrorMessages errors={errors.from_asset_id || []} />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapAssets}
          className="rounded-full h-10 w-10 bg-transparent"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="to-amount" className="text-sm font-medium">
          To
        </Label>
        <SelectInput
          label="Hey"
          options={assetOptions.filter((option) => {
            return option.class !== fromAsset.class
          })}
          value={toAsset.value}
          onValueChange={(value) => {
            handleToAssetChange(
              assetOptions.find((asset) => asset.value === value)!,
            )
            resetErrors()
          }}
          className="text-lg !h-12"
          placeholder="To Asset"
        />
        <div className="relative">
          <Input
            id="to-amount"
            type="number"
            placeholder="0.00"
            value={toAmount}
            className="text-lg h-14 pr-16"
            onChange={(e) => {
              if (!currentExchangeRate.rate) return
              handleToValueChange(e.target.value)
              resetErrors()
            }}
            disabled={!currentExchangeRate.rate}
          />
          <ErrorMessages errors={errors.to_asset_id || []} />
        </div>
      </div>
    </div>
  )
}
