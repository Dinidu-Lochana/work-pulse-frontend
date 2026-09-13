"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { AssistantWidget } from "@/components/app/AssistantWidget";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

const TEAM_MEMBER_NAV = [
  { href: "/reports", label: "My Reports", icon: FileText },
  { href: "/reports/new", label: "New Report", icon: Plus },
];

const MANAGER_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/reports", label: "All Reports", icon: ListChecks },
  { href: "/team", label: "Team", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/users", label: "User Management", icon: Users },
];

function NavLink({ href, label, icon: Icon, onNavigate }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-dashboard-soft text-brand-blue"
          : "text-muted-foreground hover:bg-dashboard-soft/60 hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === "manager" ? MANAGER_NAV : TEAM_MEMBER_NAV;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5 font-display text-base font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-blue">
            <Activity className="size-4" aria-hidden="true" />
          </span>
          WorkPulse
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 px-2">
            <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-dashboard-soft/60 hover:text-foreground"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-blue">
              <Activity className="size-4" aria-hidden="true" />
            </span>
            WorkPulse
          </div>
          <button
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-md text-foreground hover:bg-accent"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-b border-border bg-background p-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} onNavigate={() => setMobileOpen(false)} />
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2.5 rounded-md border-t border-border px-3 py-2 pt-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </nav>
        )}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {user?.role === "manager" && <AssistantWidget />}
    </div>
  );
}
