import * as React from "react";
import { cn } from "@/lib/utils";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * Click-to-toggle visibility for a shadcn / Recharts chart legend.
 *
 * @example
 * ```tsx
 * const { isHidden, LegendContent } = useChartLegend(chartConfig);
 *
 * <ChartContainer config={chartConfig}>
 *   <BarChart data={data}>
 *     <XAxis dataKey="month" />
 *     <YAxis />
 *     <ChartLegend content={<LegendContent />} />
 *     {Object.keys(chartConfig).map((key) => (
 *       //                                                       ↓ removes the series + rescales Y-axis
 *       <Bar key={key} dataKey={key} fill={`var(--color-${key})`} hide={isHidden(key)} />
 *     ))}
 *   </BarChart>
 * </ChartContainer>
 * ```
 */
export function useChartLegend(config: ChartConfig) {
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set());

  // Drop hidden keys that no longer exist in config, but never reset on plain
  // reference change — preserves user toggles when parents pass an inline config literal.
  React.useEffect(() => {
    setHidden((prev) => {
      let changed = false;
      const next = new Set<string>();
      for (const k of prev) {
        if (k in config) next.add(k);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [config]);

  const totalKeys = Object.keys(config).length;

  const toggle = React.useCallback(
    (id: string) => {
      setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          // Keep at least one series visible so the chart never goes blank.
          if (next.size + 1 >= totalKeys) return prev;
          next.add(id);
        }
        return next;
      });
    },
    [totalKeys],
  );

  const isHidden = React.useCallback((id: string) => hidden.has(id), [hidden]);

  const LegendContent = React.useCallback(
    ({
      className,
      verticalAlign = "bottom",
    }: {
      verticalAlign?: "top" | "middle" | "bottom";
      className?: string;
      nameKey?: string;
    }) => {
      const entries = Object.entries(config);
      if (!entries.length) return null;

      return (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-4",
            verticalAlign === "top" ? "pb-3" : "pt-3",
            className,
          )}
        >
          {entries.map(([key, value]) => {
            const inactive = hidden.has(key);

            const labelText = typeof value.label === "string" ? value.label : key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={!inactive}
                aria-label={`Toggle ${labelText}`}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-sm text-xs",
                  "transition-opacity duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  inactive && "opacity-40",
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-xs"
                  style={{ backgroundColor: value.color }}
                  aria-hidden="true"
                />
                <span>{value.label}</span>
              </button>
            );
          })}
        </div>
      );
    },
    [config, hidden, toggle],
  );

  return { hidden, isHidden, toggle, LegendContent };
}
