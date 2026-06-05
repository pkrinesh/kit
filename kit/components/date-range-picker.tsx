import { CalendarIcon } from 'lucide-react'
import { DateRangePicker as DateRangePickerRoot } from 'react-aria-components'
import { RangeCalendar } from './ui/calender'
import { DateInput, dateInputStyle } from './ui/date-field'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'

export function DateRangePicker({
	className,
	...props
}: React.ComponentProps<typeof DateRangePickerRoot>) {
	return (
		<DateRangePickerRoot {...props} className={cn('w-auto', className)}>
			<div className={cn(dateInputStyle, 'data-focus-within:ring-ring/50 w-auto pe-8')}>
				<DateInput slot="start" unstyled />
				<span className="text-muted-foreground/70 px-1" aria-hidden>
					–
				</span>
				<DateInput slot="end" unstyled />

				<Popover>
					<PopoverTrigger className="group absolute top-0 right-0 size-8 border-none bg-transparent p-1 focus-visible:outline-none">
						<span className="group-hover:bg-accent group-focus-visible:bg-accent flex size-full items-center justify-center rounded">
							<CalendarIcon className="size-4" />
						</span>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-auto p-2">
						<RangeCalendar />
					</PopoverContent>
				</Popover>
			</div>
		</DateRangePickerRoot>
	)
}
