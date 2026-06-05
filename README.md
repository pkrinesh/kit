# kit

A small shadcn-compatible registry of hooks and components.

| Name             | Type      | Description                                                                                                                                                                          | Install                                                    |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `show`           | Component | Type-safe conditional rendering inspired by SolidJS `<Show>`. Renders children only when all `when` values are non-null, and passes them through as non-null types.                  | `pnpm dlx shadcn@latest add pkrinesh/kit/show`             |
| `apple-tabs`     | Component | Tabs with an Apple-style sliding pill highlight. Animates the active tab background via `clip-path` and re-measures on resize.                                                       | `pnpm dlx shadcn@latest add pkrinesh/kit/apple-tabs`       |
| `useChartLegend` | Hook      | Click-to-toggle visibility for a shadcn / Recharts chart legend. Ships a `<LegendContent />` you drop into `<ChartLegend>`; hidden series are fully removed and the Y-axis rescales. | `pnpm dlx shadcn@latest add pkrinesh/kit/use-chart-legend` |
