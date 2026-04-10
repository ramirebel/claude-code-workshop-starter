"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const labelClass = "text-sm font-medium text-foreground";

export default function NewEventPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [sports, setSports] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "sport",
    sport_id: "",
    location_name: "",
    location_url: "",
    description: "",
    gender: "mixed",
    price: "0",
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/login?next=/new");
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function loadSports() {
      const supabase = createClient();
      const { data } = await supabase.from("sports").select("id, name").order("name");
      if (data) setSports(data);
    }
    loadSports();
  }, []);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("events").insert({
      name: form.name.trim(),
      type: form.type,
      sport_id: form.type === "sport" && form.sport_id ? form.sport_id : null,
      location_name: form.location_name.trim(),
      location_url: form.location_url.trim() || null,
      description: form.description.trim(),
      gender: form.gender,
      price: parseInt(form.price, 10) || 0,
      created_by: user.id,
    });
    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Host an event</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Fill in the details and publish your event for others to join.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        {error && (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="ev-name" className={labelClass}>
            Event name
          </label>
          <input
            id="ev-name"
            type="text"
            required
            placeholder="e.g. Friday Football 5v5"
            className={inputClass}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ev-type" className={labelClass}>
            Type
          </label>
          <select
            id="ev-type"
            className={inputClass}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="sport">Sport</option>
            <option value="hike">Hike / Outdoor</option>
          </select>
        </div>

        {form.type === "sport" && (
          <div>
            <label htmlFor="ev-sport" className={labelClass}>
              Sport
            </label>
            <select
              id="ev-sport"
              className={inputClass}
              value={form.sport_id}
              onChange={(e) => set("sport_id", e.target.value)}
            >
              <option value="">Select a sport</option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="ev-location" className={labelClass}>
            Location name
          </label>
          <input
            id="ev-location"
            type="text"
            required
            placeholder="e.g. Stade Municipal, Bab Ezzouar"
            className={inputClass}
            value={form.location_name}
            onChange={(e) => set("location_name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ev-url" className={labelClass}>
            Location link{" "}
            <span className="font-normal text-muted-foreground">(optional — Google Maps URL)</span>
          </label>
          <input
            id="ev-url"
            type="url"
            placeholder="https://maps.google.com/..."
            className={inputClass}
            value={form.location_url}
            onChange={(e) => set("location_url", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ev-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="ev-description"
            rows={4}
            required
            placeholder="Describe the event, rules, what to bring…"
            className={cn(inputClass, "resize-none")}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ev-gender" className={labelClass}>
            Gender
          </label>
          <select
            id="ev-gender"
            className={inputClass}
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option value="mixed">Mixed</option>
            <option value="male">Men only</option>
            <option value="female">Women only</option>
          </select>
        </div>

        <div>
          <label htmlFor="ev-price" className={labelClass}>
            Price (DA){" "}
            <span className="font-normal text-muted-foreground">— enter 0 for free</span>
          </label>
          <input
            id="ev-price"
            type="number"
            min="0"
            step="50"
            className={inputClass}
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? "Publishing…" : "Publish event"}
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-card-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
