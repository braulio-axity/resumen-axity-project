type TooltipPayloadItem = { name?: string; value?: number | string; color?: string };
type CustomTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadItem[];
};

export function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border bg-white p-2 text-sm shadow">
      <div className="font-medium">{label}</div>
      {payload.map((item, i) => (
        <div key={i}>{item.name}: {item.value}</div>
      ))}
    </div>
  );
}

// Legend content
type LegendItem = { value?: string; color?: string };
type CustomLegendProps = {
  payload?: LegendItem[];
  verticalAlign?: "top" | "middle" | "bottom";
};
export function CustomLegend({ payload, verticalAlign }: CustomLegendProps) {
  if (!payload?.length) return null;
  return (
    <div data-align={verticalAlign} className="flex gap-3 text-sm">
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded" style={{ background: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
