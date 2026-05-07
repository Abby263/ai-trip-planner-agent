import Link from "next/link";
import { Compass, MapPinned, Menu, PlaneTakeoff, Settings } from "lucide-react";
import { ReactNode } from "react";

import { ThemeToggle } from "@/components/common/ThemeToggle";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/84 backdrop-blur-xl dark:border-white/10 dark:bg-background/78">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm md:flex dark:border-white/15 dark:bg-card">
              <Menu className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20">
              <Compass className="h-5 w-5 fill-current" />
            </span>
            <span>
              Concierge
              <span className="ml-2 rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-card">
                AI
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href="/planner">
              <PlaneTakeoff className="mr-1 inline h-4 w-4" />
              Plan
            </Link>
            <Link className="hidden rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-block" href="/trips">
              <MapPinned className="mr-1 inline h-4 w-4" />
              Trips
            </Link>
            <Link className="hidden rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-block" href="/settings">
              <Settings className="mr-1 inline h-4 w-4" />
              Settings
            </Link>
            <Link className="ml-1 rounded-full border border-foreground px-4 py-2 font-medium text-foreground transition-colors hover:bg-foreground hover:text-background" href="/planner">
              Get started
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
