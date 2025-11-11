import { useQueryClient } from '@tanstack/react-query'

import { ArrowLeftRight, DollarSign, Percent, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SelectInput } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useGetLocationOptions } from '@/hooks/api/Location/useGetLocationOptionsQuery'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { useExchangeCalculator } from '@/hooks/useCalculateCurrencyData'
import { useGetCurrentExchangeRateSuspenseQuery } from '@/hooks/api/ExchangeRate/useGetCurrentExchangeRate'
import { useCreateTransactionMutation } from '@/hooks/api/Transaction/useCreateTransaction'
import { getTransactionsQuery } from '@/hooks/api/Transaction/useGetTransactions'
import { useGetCurrentLocationFeeSuspenseQuery } from '@/hooks/api/LocationFee/useGetCurrentLocationFee'
import { Badge } from '@/components/ui/badge'

type TransactionFormContentProps = {
  onOpenChange: (open: boolean) => void
}

export function TransactionFormContent({
  onOpenChange,
}: TransactionFormContentProps) {
  const queryClient = useQueryClient()

  const { data: locationOptions } = useGetLocationOptions()
  const { data: assetOptions } = useGetAssetOptions()
  const { mutate: createTransaction } = useCreateTransactionMutation()
  const { data: currentExchangeRate } = useGetCurrentExchangeRateSuspenseQuery({
    from_asset_id: assetOptions[0].value,
    to_asset_id: assetOptions.find(
      (asset) => asset.class !== assetOptions[0].class,
    )!.value,
  })

  const [location, setLocation] = useState(locationOptions[0].value)

  const { data: currentLocationFee } =
    useGetCurrentLocationFeeSuspenseQuery(location)

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
    initialAssetTo: assetOptions.find(
      (asset) => asset.class !== assetOptions[0].class,
    )!,
    initialExchangeRate: parseFloat(currentExchangeRate.rate),
    initialFeeType: currentLocationFee.fee_type,
    initialFeeValue: currentLocationFee.fee_value.toString(),
  })

  const handleReviewTrade = () => {
    if (!Number(amountFrom) || !Number(amountTo) || !exchangeRate) {
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
        to_amount:
          assetTo.class === 'FIAT'
            ? parseFloat(amountTo) + calculatedFee
            : parseFloat(amountTo),
        location_id: location,
        rate_value: exchangeRate,
      },
      {
        onSuccess() {
          onOpenChange(false)
          queryClient.invalidateQueries({
            queryKey: getTransactionsQuery().queryKey,
          })
        },
      },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New Transaction</DialogTitle>
        <DialogDescription className="flex justify-between items-center">
          <div>Add a new Transaction to the system</div>
          <Badge className='h-8 px-4 text-md' variant={assetTo.class === 'FIAT' ? 'confirm' : 'destructive'}>
            {assetTo.class === 'FIAT' ? 'Buying' : 'Selling'}
          </Badge>
        </DialogDescription>
      </DialogHeader>
      <SelectInput
        inputLabel="Location"
        label="locations"
        options={locationOptions}
        value={location}
        onValueChange={(value) => setLocation(value)}
        placeholder="Location"
      />
      <div>
        <Label className="mb-2 text-md font-bold">Fee Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={feeType === 'PCT' ? 'default' : 'outline'}
            onClick={() => setFeeType('PCT')}
            className="gap-2"
          >
            <Percent className="h-4 w-4" />
            Percentage
          </Button>
          <Button
            variant={feeType === 'FLAT' ? 'default' : 'outline'}
            onClick={() => setFeeType('FLAT')}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Flat Amount
          </Button>
        </div>
      </div>
      <div>
        <Label className="mb-2 text-md font-bold">
          {feeType === 'PCT'
            ? 'Location Fee Percentage'
            : 'Flat Location Fee Amount'}
        </Label>
        <div className="relative">
          <Input
            id="location-fee-value"
            type="number"
            placeholder={feeType === 'PCT' ? '2.5' : '10.00'}
            value={feeValue}
            className="pr-10"
            step={feeType === 'PCT' ? '0.1' : '1'}
            min="0"
            max={feeType === 'PCT' ? '100' : undefined}
            onChange={(event) => {
              setFeeValue(event.target.value)
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {feeType === 'PCT' && <Percent className="h-4 w-4" />}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapAssets}
          className="rounded-full h-10 w-10 bg-transparent"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectInput
          inputLabel="From Asset"
          label="From Asset"
          options={assetOptions}
          onValueChange={(value) =>
            setAssetFrom(assetOptions.find((asset) => asset.value === value)!)
          }
          placeholder="From Asset"
          value={assetFrom.value}
        />
        <div>
          <Label className="mb-2 text-md font-bold">From Value</Label>
          <Input
            id="from-amount"
            type="number"
            placeholder="0.00"
            value={amountFrom}
            onChange={(e) => {
              if (!currentExchangeRate.rate) return
              setAmountFrom(e.target.value)
            }}
            disabled={!currentExchangeRate.rate}
            className="text-lg pr-16"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectInput
          inputLabel="To Asset"
          label="To Asset"
          value={assetTo.value}
          onValueChange={(value) =>
            setAssetTo(assetOptions.find((asset) => asset.value === value)!)
          }
          options={assetOptions.filter((option) => {
            return option.class !== assetFrom.class
          })}
          placeholder="To Asset"
        />
        <div>
          <Label className="mb-2 text-md font-bold">To Value</Label>
          <Input
            id="to-amount"
            type="number"
            placeholder="0.00"
            value={amountTo}
            onChange={(e) => {
              if (!currentExchangeRate.rate) return
              setAmountTo(e.target.value)
            }}
            disabled={!currentExchangeRate.rate}
            className="text-lg pr-16"
          />
        </div>
      </div>

      {exchangeRate && (
        <div className="p-4 bg-muted rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Exchange Rate</span>
            <span className="font-mono font-semibold">
              1 {assetFrom.label} = {exchangeRate} {assetTo.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Location Fee Applied
            </span>
            <div className="flex gap-2 text-red-600">
              <span className="font-medium">
                - {Number(calculatedFee).toFixed(2)}
              </span>
              <span className="font-medium">
                {assetFrom.class === 'FIAT' ? assetFrom.label : assetTo.label}
              </span>
            </div>
          </div>
        </div>
      )}

      <DialogFooter className="mt-4">
        <Button
          className="h-12 w-full text-base gap-2"
          size="lg"
          variant={assetTo.class === 'FIAT' ? 'confirm' : "destructive"}
          onClick={handleReviewTrade}
          disabled={!Number(amountFrom) || !Number(amountTo) || !exchangeRate}
        >
          {exchangeRate ? (
            <>
              {assetTo.class === 'FIAT' ? (
                <ShoppingCart className="h-4 w-4" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              {assetTo.class === 'FIAT' ? 'Buy' : 'Sell'}
            </>
          ) : (
            <>No exchange rate found</>
          )}
        </Button>
      </DialogFooter>
    </>
  )
}
