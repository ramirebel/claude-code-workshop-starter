import Link from "next/link";
import { ColorSwatches } from "./ColorSwatches";
import { InteractiveDemo } from "./InteractiveDemo";
import { SampleCards } from "./SampleCards";
import { ThemeToggle } from "./ThemeToggle";

export function UiPlayground() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            UI playground
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Tweak tokens & components
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Edit{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              globals.css
            </code>{" "}
            and save — hot reload updates colors, radius, and shadows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Semantic colors
        </h2>
        <ColorSwatches />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Cards
        </h2>
        <SampleCards />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Interactive
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <InteractiveDemo />
        </div>
      </section>
    </div>
  );
}
