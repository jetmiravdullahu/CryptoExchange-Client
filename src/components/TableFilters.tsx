import dayjs from 'dayjs'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { SelectInput } from './ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type TableFiltersProps = {
  onChange?: (filters: { from?: string; to?: string; type?: string }) => void
  className?: string
  options: {
    from?: string
    to?: string
    type?: string
  }
  onSetFilters: (key: 'from' | 'to' | 'type', value?: string) => void
}

export default function TableFilters({
  options,
  onSetFilters,
  className,
}: TableFiltersProps) {
  const formatDate = (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '')

  return (
    <div className={cn('flex gap-4', className)}>
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
        <Label className="mb-2" htmlFor="type">
          Type
        </Label>
        <SelectInput
          id="type"
          name="test"
          label="Type"
          onValueChange={(value) => onSetFilters('type', value)}
          options={[
            {
              value: 'MANUAL_ADJUSTMENT',
              label: 'Manual Adjustment',
            },
            {
              value: 'TRANSACTION',
              label: 'Transaction',
            },
            {
              value: 'TRANSFER',
              label: 'Transfer',
            },
            {
              value: 'CORRECTION',
              label: 'Correction',
            },
          ]}
          placeholder="Type"
          value={options.type}
          clearable
          onClear={() => onSetFilters('type')}
        />
      </div>
    </div>
  )
}
