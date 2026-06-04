import { Tabs, TabsList, TabsTrigger, type TabsProps } from "@radix-ui/react-tabs";
import { DynamicIcon } from "lucide-react/dynamic";
import * as React from "react";
import { cn } from "@/lib/utils";

export type AppleTabsProps = {
  tabList: {
    label: string;
    value: string;
    icon?: React.ComponentProps<typeof DynamicIcon>["name"];
  }[];
} & TabsProps;

const triggerClass = cn(
  "flex h-full items-center rounded-sm px-3 text-sm",
  "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none",
);

export function AppleTabs({
  tabList,
  className,
  value,
  onValueChange,
  children,
  ...restProps
}: AppleTabsProps) {
  const activeTabRef = React.useRef<HTMLButtonElement>(null);
  const clipContainerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const clipContainerElement = clipContainerRef.current;
    const activeTabElement = activeTabRef.current;
    if (!clipContainerElement || !activeTabElement || !value) return;

    const measure = () => {
      const containerWidth = clipContainerElement.offsetWidth;
      if (!containerWidth) return;
      const { offsetLeft, offsetWidth } = activeTabElement;
      const leftPct = (offsetLeft / containerWidth) * 100;
      const rightPct = 100 - ((offsetLeft + offsetWidth) / containerWidth) * 100;
      clipContainerElement.style.clipPath = `inset(0.125rem ${rightPct.toFixed(2)}% 0.125rem ${leftPct.toFixed(2)}% round var(--radius-sm))`;
    };

    measure();

    // Re-measure on container resize, font load, or label/tab changes.
    const ro = new ResizeObserver(measure);
    ro.observe(clipContainerElement);
    const baseList = activeTabElement.parentElement;
    if (baseList) ro.observe(baseList);
    return () => ro.disconnect();
  }, [value]);

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "bg-card relative flex h-8 w-fit items-center rounded-md border p-0.5 shadow-sm",
        className,
      )}
      {...restProps}
    >
      <TabsList className="relative inline-flex h-full items-center gap-2">
        {tabList.map((tab) => (
          <TabsTrigger
            ref={value === tab.value ? activeTabRef : null}
            key={tab.value}
            value={tab.value}
            className={triggerClass}
          >
            {tab.icon && <DynamicIcon name={tab.icon} className="mr-2 h-4 w-4" />}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div
        ref={clipContainerRef}
        aria-hidden
        className="absolute inset-y-0 transition-[clip-path] duration-200 ease-out"
      >
        <TabsList
          className="bg-primary text-primary-foreground border-primary relative inline-flex h-full items-center gap-2 shadow-sm"
          tabIndex={-1}
        >
          {tabList.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={triggerClass} tabIndex={-1}>
              {tab?.icon && <DynamicIcon name={tab.icon} className="mr-2 h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {children}
    </Tabs>
  );
}
