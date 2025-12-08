import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SelectInput } from '@/components/ui/select'
import { MultiSelect } from '@/components/MultiSelect'
import { useGetLocationOptions } from '@/hooks/api/Location/useGetLocationOptionsQuery'

type TableFiltersProps = {
  onChange?: (filters: { from?: string; to?: string; type?: string }) => void
  className?: string
  options: {
    from?: string
    to?: string
    asset_id?: string
    location_ids?: Array<string>
  }
  onSetFilters: (key: string, value?: string | Array<string>) => void
}

export default function TransactionSummaryFilters({
  options,
  onSetFilters,
  className,
}: TableFiltersProps) {
  const formatDate = (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '')

  const { data: assetOptions } = useGetAssetOptions()
  const { data: locationOptions } = useGetLocationOptions()

  return (
    <div className={cn('flex gap-4 flex-wrap', className)}>
      <div className="flex flex-col">
        <Label className="mb-2" htmlFor="from-date">
          From
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="from-date"
              className={cn(
                'w-[160px] justify-start',
                !options.to && 'text-muted-foreground',
              )}
            >
              {options.from ? formatDate(options.from) : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dayjs(options.from).toDate()}
              autoFocus
              onDayClick={(date) => {
                onSetFilters('from', dayjs(date).format('YYYY-MM-DD'))
              }}
            />
            <div className="p-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => onSetFilters('from')}
                size="sm"
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col">
        <Label className="mb-2" htmlFor="to-date">
          To
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="to-date"
              className={cn(
                'w-[160px] justify-start',
                !options.to && 'text-muted-foreground',
              )}
            >
              {options.to ? formatDate(options.to) : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dayjs(options.to).toDate()}
              autoFocus
              disabled={[
                { after: dayjs(options.from).add(1, 'year').toDate() }, // disable dates after 1 year
              ]}
              id="test"
              onDayClick={(date) => {
                onSetFilters('to', dayjs(date).format('YYYY-MM-DD'))
              }}
            />
            <div className="p-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => onSetFilters('to')}
                size="sm"
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col min-w-[160px]">
        <Label className="mb-2" htmlFor="asset_id">
          Asset
        </Label>
        <SelectInput
          id="asset_id"
          name="asset_id"
          onValueChange={(value) => onSetFilters('asset_id', value)}
          label="Asset"
          options={assetOptions}
          placeholder="Asset"
          value={options.asset_id}
          clearable
          onClear={() => onSetFilters('asset_id')}
        />
      </div>
      <div className="flex flex-col min-w-[160px]">
        <Label className="mb-2" htmlFor="asset_id">
          Locations
        </Label>
        <MultiSelect
          selected={options.location_ids || []}
          options={locationOptions}
          onChange={(data) => onSetFilters('location_ids', data)}
        />
      </div>
    </div>
  )
}
