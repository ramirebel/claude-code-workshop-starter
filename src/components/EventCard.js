import { cn } from "@/lib/utils";

const GENDER_LABEL = { male: "Men only", female: "Women only", mixed: "Mixed" };

export function EventCard({ event, onClick }) {
  const sportName = event.sports?.name ?? "Hike";
  const isFree = event.price === 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border border-border bg-card p-5 shadow-sm",
        "hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{event.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground truncate">{event.location_name}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {sportName}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
          {GENDER_LABEL[event.gender] ?? event.gender}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            isFree
              ? "bg-accent text-accent-foreground"
              : "bg-secondary/10 text-secondary-foreground"
          )}
        >
          {isFree ? "Free" : `${event.price} DA`}
        </span>
      </div>
    </button>
  );
}
