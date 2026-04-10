"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { EventCard } from "@/components/EventCard";
import { EventModal } from "@/components/EventModal";
import { cn } from "@/lib/utils";
const SPORT_ICONS = {
  Football:   "⚽",
  Basketball: "🏀",
  Handball:   "🤾",
  Volleyball: "🏐",
  Tennis:     "🎾",
  Padel:      "🏓",
  Running:    "🏃",
  Hiking:     "🥾",
};

const GENDER_OPTIONS = [
  { value: null,     label: "All" },
  { value: "male",   label: "Men" },
  { value: "female", label: "Women" },
  { value: "mixed",  label: "Mixed" },
];

export function HomeClient({ events }) {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const availableSports = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      if (e.sports?.name) map.set(e.sports.name, e.sports);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  const activeEvents = useMemo(
    () => events.filter((e) => !e.cancelled_at),
    [events]
  );

  const cancelledParticipated = useMemo(
    () =>
      events.filter(
        (e) =>
          e.cancelled_at &&
          user &&
          e.participations?.some((p) => p.user_id === user.id)
      ),
    [events, user]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeEvents
      .filter((e) => !selectedSport || e.sports?.name === selectedSport)
      .filter((e) => !selectedGender || e.gender === selectedGender)
      .filter(
        (e) =>
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.location_name.toLowerCase().includes(q) ||
          (e.sports?.name ?? "").toLowerCase().includes(q)
      );
  }, [activeEvents, selectedSport, selectedGender, search]);

  function FilterChip({ active, onClick, children }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:bg-muted"
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find your next game
        </h1>
        <p className="mt-3 text-muted-foreground">
          Join local sports events and outdoor activities near you.
        </p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="search"
          placeholder="Search by name, sport, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </div>

      {/* Sport filters */}
      {availableSports.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          <FilterChip active={!selectedSport} onClick={() => setSelectedSport(null)}>
            All sports
          </FilterChip>
          {availableSports.map((s) => (
            <FilterChip
              key={s.name}
              active={selectedSport === s.name}
              onClick={() => setSelectedSport(selectedSport === s.name ? null : s.name)}
            >
              {SPORT_ICONS[s.name] ?? "🏅"} {s.name}
            </FilterChip>
          ))}
        </div>
      )}

      {/* Gender filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {GENDER_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value ?? "all"}
            active={selectedGender === opt.value}
            onClick={() => setSelectedGender(opt.value)}
          >
            {opt.label}
          </FilterChip>
        ))}
      </div>

      {/* Events header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + Host event
        </Link>
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {search || selectedSport || selectedGender
            ? "No events match your filters."
            : "No events yet — be the first to host one!"}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
        </div>
      )}

      {/* Cancelled events the user joined */}
      {cancelledParticipated.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Cancelled events you joined
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cancelledParticipated.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                cancelled
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={() => {
            setSelectedEvent(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
