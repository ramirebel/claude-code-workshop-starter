"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

export function InteractiveDemo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={cn(
            buttonBase,
            "bg-primary text-primary-foreground hover:opacity-90"
          )}
          onClick={() => setCount((c) => c + 1)}
        >
          Count: {count}
        </button>
        <button
          type="button"
          className={cn(
            buttonBase,
            "border border-border bg-transparent hover:bg-muted"
          )}
          onClick={() => setCount(0)}
        >
          Reset
        </button>
        <button
          type="button"
          className={cn(
            buttonBase,
            "bg-secondary text-secondary-foreground hover:opacity-90"
          )}
          onClick={() => setMessage("Secondary action")}
        >
          Secondary
        </button>
        <button
          type="button"
          className={cn(
            buttonBase,
            "bg-destructive text-destructive-foreground hover:opacity-90"
          )}
          onClick={() => setMessage("Destructive (demo only)")}
        >
          Destructive
        </button>
      </div>

      {message ? (
        <p className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {message}
          <button
            type="button"
            className="ml-2 text-foreground underline underline-offset-2"
            onClick={() => setMessage("")}
          >
            Clear
          </button>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Text input
          <input
            type="text"
            placeholder="Type to see focus ring…"
            className="h-10 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Select
          <select className="h-10 rounded-lg border border-input bg-background px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border-border text-primary focus:ring-ring"
        />
        <span>Sample checkbox (native)</span>
      </label>
    </div>
  );
}
