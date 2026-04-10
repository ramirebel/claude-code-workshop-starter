"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAuthOnlyPath } from "@/lib/auth/routes";
import { ThemeToggle } from "@/components/ui-playground/ThemeToggle";
import { cn } from "@/lib/utils";

const linkClass =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  if (pathname && isAuthOnlyPath(pathname)) return null;

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Active2gether
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={cn(
                  "hidden sm:inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname === "/" && "text-foreground",
                )}
              >
                Home
              </Link>
              <Link
                href="/account"
                className={cn(
                  "inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname?.startsWith("/account") && "text-foreground",
                )}
              >
                {displayName}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
