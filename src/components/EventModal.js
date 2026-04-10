"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const GENDER_LABEL = { male: "Men only", female: "Women only", mixed: "Mixed" };

export function EventModal({ event, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [participations, setParticipations] = useState([]);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("participations")
        .select("id, full_name, user_id")
        .eq("event_id", event.id);

      if (data) {
        setParticipations(data);
        if (user) setAlreadyJoined(data.some((p) => p.user_id === user.id));
      }

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            full_name: profile.full_name ?? "",
            phone: profile.phone ?? "",
          }));
        }
      }
    }
    load();
  }, [event.id, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("participations").insert({
      event_id: event.id,
      user_id: user.id,
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim() || null,
    });
    setSubmitting(false);
    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "You've already joined this event."
          : insertError.message
      );
      if (insertError.code === "23505") setAlreadyJoined(true);
      return;
    }
    setSuccess(true);
    setAlreadyJoined(true);
    setParticipations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), full_name: formData.full_name, user_id: user.id },
    ]);
  }

  const sportName = event.sports?.name ?? "Hike";
  const isFree = event.price === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{event.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{event.location_name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {sportName}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {GENDER_LABEL[event.gender] ?? event.gender}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {isFree ? "Free" : `${event.price} DA`}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {participations.length} participant{participations.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-foreground">{event.description}</p>

          {/* Map link */}
          {event.location_url && (
            <a
              href={event.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View on map →
            </a>
          )}

          <hr className="my-5 border-border" />

          {/* Participation section */}
          {success ? (
            <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              You&apos;re in! See you at the event.
            </div>
          ) : alreadyJoined ? (
            <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
              You&apos;ve already joined this event.
            </div>
          ) : !isAuthenticated ? (
            <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm">
              <button
                type="button"
                onClick={() => router.push("/login?next=/")}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </button>{" "}
              <span className="text-muted-foreground">to join this event.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">Join this event</h3>
              {error && (
                <p
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="p-name" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="p-name"
                  type="text"
                  required
                  className={inputClass}
                  value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="p-phone" className="text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="p-phone"
                  type="tel"
                  required
                  className={inputClass}
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="p-message" className="text-sm font-medium text-foreground">
                  Message{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="p-message"
                  rows={2}
                  className={cn(inputClass, "resize-none")}
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? "Joining…" : "Join event"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
