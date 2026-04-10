const SWATCHES = [
  { label: "Background", className: "bg-background border-border" },
  { label: "Foreground", className: "bg-foreground" },
  { label: "Primary", className: "bg-primary" },
  { label: "Secondary", className: "bg-secondary" },
  { label: "Muted", className: "bg-muted" },
  { label: "Accent", className: "bg-accent" },
  { label: "Destructive", className: "bg-destructive" },
  { label: "Border", className: "bg-border" },
];

export function ColorSwatches() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SWATCHES.map(({ label, className }) => (
        <div
          key={label}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-xs"
        >
          <div
            className={`h-14 w-full rounded-md border border-border ${className}`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
