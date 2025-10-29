import { Suspense } from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { CurrencyConverter } from './CurrencyConverter'
import { Button } from './ui/button'
import { LocationFeeConfiguration } from './LocationFeeConfiguration'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { useCreateTransactionMutation } from '@/hooks/api/Transaction/useCreateTransaction'
import { useExchangeCalculator } from '@/hooks/useCalculateCurrencyData'
import { useGetCurrentExchangeRateSuspenseQuery } from '@/hooks/api/ExchangeRate/useGetCurrentExchangeRate'
import { useGetCurrentLocationFeeSuspenseQuery } from '@/hooks/api/LocationFee/useGetCurrentLocationFee'
import { getTransactionQuery } from '@/hooks/api/Transaction/useGetTransaction'
import { getTransactionsQuery } from '@/hooks/api/Transaction/useGetTransactions'

export const ExchangeSection = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: assetOptions } = useGetAssetOptions()
  const { mutate: createTransaction } = useCreateTransactionMutation()
  const { data: currentLocationFee } = useGetCurrentLocationFeeSuspenseQuery()

  const { data: currentExchangeRate } = useGetCurrentExchangeRateSuspenseQuery({
    from_asset_id: assetOptions[0].value,
    to_asset_id: assetOptions[1].value,
  })

  const {
    assetFrom,
    setAssetFrom,
    assetTo,
    setAssetTo,

    amountFrom,
    setAmountFrom,
    amountTo,
    setAmountTo,

    feeType,
    setFeeType,
    feeValue,
    setFeeValue,
    exchangeRate,
    handleSwapAssets,
    calculatedFee,
  } = useExchangeCalculator({
    initialAssetFrom: assetOptions[0],
    initialAssetTo: assetOptions[1],
    initialExchangeRate: parseFloat(currentExchangeRate.rate),
  })

  const handleReviewTrade = () => {
    if (!amountFrom || !amountTo || !exchangeRate) {
      toast.error('Please enter valid amounts to trade.')
      return
    }
    createTransaction(
      {
        exchange_rate_id: currentExchangeRate.id,
        fee_basis_type: feeType,
        fee_basis_value: parseFloat(feeValue),
        fee_flat: calculatedFee,
        from_asset_id: assetFrom.value,
        to_asset_id: assetTo.value,
        from_amount: parseFloat(amountFrom),
        to_amount: parseFloat(amountTo),
        location_id: currentLocationFee.location_id,
        rate_value: exchangeRate,
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(
            getTransactionQuery(response.data.id).queryKey,
            response.data,
          )

          queryClient.invalidateQueries({
            queryKey: getTransactionsQuery().queryKey
          })

          navigate({
            to: `/exchange-confirmation/${response.data.id}`,
          })
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
      <Card className="lg:col-span-2 relative">
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
          {!!exchangeRate && (
            <CardDescription>
              Exchange rate: 1 {assetFrom.label} ={' '}
              {Number(exchangeRate).toFixed(2)} {assetTo.label}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Suspense fallback={<div>Loading Converter...</div>}>
            <CurrencyConverter
              fromAmount={amountFrom}
              toAmount={amountTo}
              fromAsset={assetFrom}
              toAsset={assetTo}
              handleFromAssetChange={setAssetFrom}
              handleFromValueChange={setAmountFrom}
              handleToAssetChange={setAssetTo}
              handleSwapAssets={handleSwapAssets}
              handleToValueChange={setAmountTo}
            />
          </Suspense>

          {!!parseFloat(amountFrom) && !!parseFloat(amountTo) && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Location Fee Applied:
                </span>
                <div className="flex gap-2 text-red-600">
                  <span className="font-medium">
                    - {Number(calculatedFee).toFixed(2)}
                  </span>
                  <span className="font-medium">
                    {assetFrom.class === 'FIAT'
                      ? assetFrom.label
                      : assetTo.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            className="h-12 w-full text-base gap-2"
            size="lg"
            onClick={handleReviewTrade}
            disabled={!amountFrom || !amountTo || !exchangeRate}
          >
            {exchangeRate ? (
              <>
                <Eye className="h-4 w-4" />
                Review Trade
              </>
            ) : (
              <>No exchange rate found</>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="order-first lg:order-none">
        <LocationFeeConfiguration
          locationFeeType={feeType}
          locationFeeValue={feeValue}
          handleLocationFeeTypeChange={setFeeType}
          handleLocationFeeValueChange={setFeeValue}
        />
      </div>
    </div>
  )
}
