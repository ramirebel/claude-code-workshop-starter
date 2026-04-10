"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAuthOnlyPath } from "@/lib/auth/routes";
import { ThemeToggle } from "@/components/ui-playground/ThemeToggle";
import { cn } from "@/lib/utils";

const linkClass =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
const primaryLinkClass =
  "text-sm font-medium text-primary underline-offset-4 hover:underline";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  if (pathname && isAuthOnlyPath(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          ActiveTogether
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <ThemeToggle />
          <Link href="/" className={cn(linkClass, pathname === "/" && "text-foreground")}>
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/new"
                className={cn(
                  "text-sm font-medium rounded-lg border border-border bg-card px-3 py-1.5 text-card-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
                  pathname?.startsWith("/new") && "bg-accent text-accent-foreground"
                )}
              >
                + Host event
              </Link>
              <Link
                href="/account"
                className={cn(
                  linkClass,
                  pathname?.startsWith("/account") && "text-foreground"
                )}
              >
                Account
              </Link>
              <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:inline">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className={cn(
                  "rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground shadow-xs",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
              <Link href="/signup" className={primaryLinkClass}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
