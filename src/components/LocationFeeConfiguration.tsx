import { DollarSign, Percent } from 'lucide-react'
import { LoadingSpinner } from './LoadingComponent'
import type { FeeType } from '@/types/locationFee'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useGetCurrentLocationFee } from '@/hooks/api/LocationFee/useGetCurrentLocationFee'

interface LocationFeeConfigurationProps {
  locationFeeType: FeeType
  locationFeeValue: string
  handleLocationFeeTypeChange: (type: FeeType) => void
  handleLocationFeeValueChange: (value: string) => void
}

export function LocationFeeConfiguration({
  locationFeeType,
  locationFeeValue,
  handleLocationFeeTypeChange,
  handleLocationFeeValueChange,
}: LocationFeeConfigurationProps) {
  const { isLoading: isLoadingLocationFee } = useGetCurrentLocationFee()

  return (
    <Card className="h-full relative">
      {isLoadingLocationFee && <LoadingSpinner />}
      <CardHeader>
        <CardTitle>Location Fee Configuration</CardTitle>
        <CardDescription>
          Set your preferred location fee method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location Fee Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={locationFeeType === 'PCT' ? 'default' : 'outline'}
              onClick={() => handleLocationFeeTypeChange('PCT')}
              className="gap-2"
            >
              <Percent className="h-4 w-4" />
              Percentage
            </Button>
            <Button
              variant={locationFeeType === 'FLAT' ? 'default' : 'outline'}
              onClick={() => handleLocationFeeTypeChange('FLAT')}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Flat Amount
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-fee-value" className="text-sm font-medium">
            {locationFeeType === 'PCT'
              ? 'Location Fee Percentage'
              : 'Flat Location Fee Amount'}
          </Label>
          <div className="relative">
            <Input
              id="location-fee-value"
              type="number"
              placeholder={locationFeeType === 'PCT' ? '2.5' : '10.00'}
              value={locationFeeValue}
              className="pr-10"
              step={locationFeeType === 'PCT' ? '0.1' : '1'}
              min="0"
              max={locationFeeType === 'PCT' ? '100' : undefined}
              onChange={(event) => {
                handleLocationFeeValueChange(event.target.value)
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {locationFeeType === 'PCT' && <Percent className="h-4 w-4" />}
            </span>
          </div>
        </div>

        {/* LocationFee Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {locationFeeType === 'PCT'
              ? 'Location fee will be calculated as a percentage of the converted amount.'
              : 'A fixed location fee will be applied to each transaction.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
