"use client";

import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventModal } from "@/components/EventModal";

export function HomeClient({ events }) {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = search.trim()
    ? events.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.location_name.toLowerCase().includes(q) ||
          (e.sports?.name ?? "").toLowerCase().includes(q)
        );
      })
    : events;

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
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search by sport, name, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {search ? "No events match your search." : "No events yet — be the first to host one!"}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
