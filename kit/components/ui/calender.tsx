import { CalendarDate, getLocalTimeZone, isToday, today } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ComponentProps } from "react";
import {
  Button as ButtonRac,
  CalendarCell as CalendarCellRac,
  CalendarContext,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  composeRenderProps,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
  RangeCalendarContext,
  useSlottedContext,
} from "react-aria-components";
import { Button, buttonVariants } from "./button";
import { cn } from "@/lib/utils";

interface BaseCalendarProps {
  className?: string;
}

type CalendarProps = ComponentProps<typeof CalendarRac> &
  BaseCalendarProps & {
    /**
     * Show a "Today" button to reset the calendar to today's date.
     * @default true
     */
    showTodayButton?: boolean;
  };
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> &
  BaseCalendarProps & {
    /**
     * Show preset buttons (Week, Month, 3 Months, etc.)
     * @default true
     */
    showPresets?: boolean;
  };

function CalendarHeader() {
  return (
    <header className="flex w-full items-center gap-1 pb-1">
      <ButtonRac
        className={cn(buttonVariants({ size: "icon", variant: "ghost" }), "size-7")}
        slot="previous"
      >
        <ChevronLeftIcon className="size-4" />
      </ButtonRac>
      <HeadingRac className="grow text-center text-sm font-medium" />
      <ButtonRac
        className={cn(buttonVariants({ size: "icon", variant: "ghost" }), "size-7")}
        slot="next"
      >
        <ChevronRightIcon className="size-4" />
      </ButtonRac>
    </header>
  );
}

function Preset({ date, children }: { date: CalendarDate; children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = useSlottedContext(CalendarContext)!;
  const isNow = context.value && isToday(context.value, getLocalTimeZone());

  const handleClick = () => {
    context.onChange?.(date);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="mt-1 w-full"
      onClick={handleClick}
      disabled={isNow}
    >
      {children}
    </Button>
  );
}

function CalendarGridComponent({ isRange = false }: { isRange?: boolean }) {
  const now = today(getLocalTimeZone());

  return (
    <CalendarGridRac>
      <CalendarGridHeaderRac>
        {(day) => (
          <CalendarHeaderCellRac className="text-muted-foreground/80 size-7 rounded-md p-0 text-xs font-medium">
            {day}
          </CalendarHeaderCellRac>
        )}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0 [&_td]:py-px">
        {(date) => (
          <CalendarCellRac
            className={cn(
              "text-foreground data-hovered:bg-accent data-selected:bg-primary data-hovered:text-foreground data-selected:text-primary-foreground data-focus-visible:ring-ring/50 relative flex size-7 items-center justify-center rounded-md p-0 text-sm font-normal whitespace-nowrap [transition-property:color,background-color,border-radius,box-shadow] duration-150 outline-none data-disabled:pointer-events-none data-disabled:opacity-30 data-focus-visible:z-10 data-focus-visible:ring-[3px] data-unavailable:pointer-events-none data-unavailable:line-through data-unavailable:opacity-30",
              // Range-specific styles
              isRange &&
                "data-invalid:data-selection-end:bg-destructive data-invalid:data-selection-start:bg-destructive data-selected:bg-accent data-selection-end:bg-primary data-selection-start:bg-primary data-selected:text-foreground data-selection-end:text-primary-foreground data-selection-start:text-primary-foreground data-invalid:bg-destructive/10 data-invalid:data-selection-end:text-destructive-foreground data-invalid:data-selection-start:text-destructive-foreground data-selected:rounded-none data-selection-end:rounded-e-md data-selection-start:rounded-s-md",
              // Today indicator styles
              date.compare(now) === 0 &&
                cn(
                  "after:bg-primary after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                  isRange
                    ? "data-selection-end:after:bg-background data-selection-start:after:bg-background"
                    : "data-selected:after:bg-background",
                ),
            )}
            date={date}
          />
        )}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  );
}

function Calendar({ className, showTodayButton = true, ...props }: CalendarProps) {
  const now = today(getLocalTimeZone());

  return (
    <CalendarRac
      {...props}
      className={composeRenderProps(className, (className) => cn("w-fit", className))}
    >
      <CalendarHeader />
      <CalendarGridComponent />
      {showTodayButton && <Preset date={now} children="Today" />}
    </CalendarRac>
  );
}

interface RangePreset {
  label: string;
  days: number;
}

const RANGE_PRESETS: RangePreset[] = [
  { label: "Week", days: 7 },
  { label: "Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "Year", days: 365 },
];

function RangePresetButton({ preset }: { preset: RangePreset }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = useSlottedContext(RangeCalendarContext)!;

  const now = today(getLocalTimeZone());
  const start = now.subtract({ days: preset.days });
  const range = { start, end: now };

  const handleClick = () => {
    context.onChange?.(range);
  };

  return (
    <Button type="button" variant="ghost" size="xs" onClick={handleClick}>
      {preset.label}
    </Button>
  );
}

function RangePresets() {
  return (
    <div className="mt-8 flex flex-col items-start gap-1">
      {RANGE_PRESETS.map((preset) => (
        <RangePresetButton key={preset.label} preset={preset} />
      ))}
    </div>
  );
}

function RangeCalendar({ className, showPresets = true, ...props }: RangeCalendarProps) {
  return (
    <RangeCalendarRac
      {...props}
      className={composeRenderProps(className, (className) => cn("w-fit", className))}
    >
      <div className="flex gap-2">
        {showPresets && <RangePresets />}
        <div>
          <CalendarHeader />
          <CalendarGridComponent isRange />
        </div>
      </div>
    </RangeCalendarRac>
  );
}

export { Calendar, RangeCalendar };
