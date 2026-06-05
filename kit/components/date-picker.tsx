import { CalendarIcon } from 'lucide-react'
import { DateField, DatePicker as DatePickerRoot } from 'react-aria-components'
import { Calendar } from './ui/calender'
import { DateInput } from './ui/date-field'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker({ className, ...props }: React.ComponentProps<typeof DatePickerRoot>) {
	return (
		<DatePickerRoot {...props} className={cn('w-auto', className)}>
			<div className="relative">
				<DateField aria-label="pick the date">
					<DateInput />
				</DateField>
				<Popover>
					<PopoverTrigger className="group absolute top-0 right-0 size-8 border-none bg-transparent p-1 focus-visible:outline-none">
						<span className="group-hover:bg-accent group-focus-visible:bg-accent flex size-full items-center justify-center rounded">
							<CalendarIcon className="size-4" />
						</span>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-2">
						<Calendar />
					</PopoverContent>
				</Popover>
			</div>
		</DatePickerRoot>
	)
}
