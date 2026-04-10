import Image from "next/image";
import { cn } from "@/lib/utils";

const GENDER_LABEL = { male: "Men only", female: "Women only", mixed: "Mixed" };

const TYPE_STYLES = {
  casual:     "bg-accent text-accent-foreground",
  training:   "bg-secondary/20 text-secondary-foreground",
  tournament: "bg-primary/10 text-primary",
};

const TYPE_LABEL = {
  casual:     "Casual",
  training:   "Training",
  tournament: "Tournament",
};

const SPORT_IMAGES = {
  Football:   "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=240&fit=crop&q=75",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=240&fit=crop&q=75",
  Handball:   "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600&h=240&fit=crop&q=75",
  Volleyball: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&h=240&fit=crop&q=75",
  Tennis:     "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=240&fit=crop&q=75",
  Padel:      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=240&fit=crop&q=75",
  Running:    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=240&fit=crop&q=75",
  Hiking:     "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=240&fit=crop&q=75",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=240&fit=crop&q=75";

export function EventCard({ event, onClick, cancelled = false }) {
  const sportName = event.sports?.name ?? "General";
  const isFree    = event.price === 0;
  const joined    = event.participations?.length ?? 0;
  const max       = event.max_participants ?? null;
  const isFull    = max !== null && joined >= max;
  const imgSrc    = SPORT_IMAGES[sportName] ?? DEFAULT_IMAGE;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border border-border bg-card shadow-sm transition-all cursor-pointer overflow-hidden",
        cancelled
          ? "opacity-60 grayscale hover:opacity-70"
          : isFull
          ? "opacity-75 hover:border-border"
          : "hover:border-primary/50 hover:shadow-md"
      )}
    >
      {/* Sport image */}
      <div className="relative h-36 w-full">
        <Image
          src={imgSrc}
          alt={sportName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Cancelled overlay */}
        {cancelled && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
              Cancelled
            </span>
          </div>
        )}
        {/* Full overlay badge */}
        {isFull && !cancelled && (
          <div className="absolute right-2 top-2">
            <span className="rounded-full bg-destructive/90 px-2.5 py-0.5 text-xs font-semibold text-white">
              Full
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">{event.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground truncate">{event.location_name}</p>
          </div>
          {!cancelled && (
            <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", TYPE_STYLES[event.type] ?? TYPE_STYLES.casual)}>
              {TYPE_LABEL[event.type] ?? event.type}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {GENDER_LABEL[event.gender] ?? event.gender}
          </span>
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            isFree ? "bg-accent text-accent-foreground" : "bg-secondary/10 text-secondary-foreground"
          )}>
            {isFree ? "Free" : `${event.price} DA`}
          </span>
          {!cancelled && !isFull && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {max ? `${joined} / ${max} spots` : `${joined} joined`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
