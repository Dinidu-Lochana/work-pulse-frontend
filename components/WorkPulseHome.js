"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PanelsTopLeft,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const team = [
  { initials: "AM", name: "Alex Morgan", role: "Product Designer", status: "Approved", tasks: 12 },
  { initials: "JL", name: "Jordan Lee", role: "Frontend Engineer", status: "Submitted", tasks: 9 },
  { initials: "SK", name: "Sam Kim", role: "Product Manager", status: "Needs correction", tasks: 7 },
  { initials: "TR", name: "Taylor Reed", role: "Backend Engineer", status: "Approved", tasks: 11 },
];

const featureCards = [
  {
    number: "01",
    title: "Weekly Reports",
    text: "Create structured reports with completed tasks, planned work, blockers, achievements, and time spent.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Review & Approval",
    text: "Managers can review submitted reports, request corrections, and approve completed reports.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Team Insights",
    text: "Understand submission compliance, workload, task distribution, blockers, and team performance.",
    icon: BarChart3,
  },
];

function PulseMark({ compact = false }) {
  return (
    <span className={cn("grid place-items-center rounded-lg bg-brand-blue", compact ? "size-8" : "size-9")}>
      <Activity aria-hidden="true" className={compact ? "size-4" : "size-5"} />
    </span>
  );
}

function Brand({ dark = false }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5 font-display text-lg font-bold", dark ? "text-hero-foreground" : "text-foreground")}>
      <PulseMark compact />
      WorkPulse
    </a>
  );
}

function StatusBadge({ status }) {
  const tone = status === "Approved" ? "approved" : status === "Submitted" ? "submitted" : "correction";
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold", `status-${tone}`)}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function MiniChart() {
  const heights = [38, 54, 47, 70, 64, 86, 78];
  return (
    <div className="flex h-20 items-end gap-2" aria-label="Completed tasks increased over seven weeks">
      {heights.map((height, index) => (
        <span key={height + index} className="chart-bar flex-1 rounded-t-sm bg-brand-blue/15" style={{ "--bar-height": `${height}%` }}>
          <span className="block h-full rounded-t-sm bg-brand-blue" />
        </span>
      ))}
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="dashboard-shell animate-dashboard-in" aria-label="WorkPulse dashboard preview">
      <div className="flex h-12 items-center justify-between border-b border-dashboard-border px-4">
        <div className="flex items-center gap-2 text-dashboard-foreground">
          <PulseMark compact />
          <span className="text-xs font-bold">WorkPulse</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-full bg-dashboard-soft" />
          <MoreHorizontal className="size-4 text-dashboard-muted" />
        </div>
      </div>
      <div className="grid grid-cols-[54px_1fr] sm:grid-cols-[112px_1fr]">
        <div className="min-h-[330px] border-r border-dashboard-border bg-dashboard-sidebar p-2 sm:p-3">
          {[PanelsTopLeft, FileText, Users, BarChart3].map((Icon, index) => (
            <div key={index} className={cn("mb-2 flex h-8 items-center gap-2 rounded-md px-2 text-[9px]", index === 0 ? "bg-dashboard-soft text-brand-blue" : "text-dashboard-muted")}>
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{["Overview", "Reports", "Team", "Insights"][index]}</span>
            </div>
          ))}
        </div>
        <div className="min-w-0 bg-dashboard-canvas p-3 sm:p-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] text-dashboard-muted">Friday, September 11</p>
              <p className="mt-0.5 text-sm font-bold text-dashboard-foreground">Good morning, Olivia</p>
            </div>
            <span className="hidden text-[9px] font-semibold text-brand-blue sm:inline">Week 37</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["12/16", "Reports", FileText], ["84%", "Submitted", CheckCircle2], ["38", "Tasks done", Check], ["4", "Blockers", CircleAlert]].map(([value, label, MetricIcon], index) => (
              <div key={label} className="dashboard-card animate-card-in p-2.5" style={{ animationDelay: `${180 + index * 80}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-dashboard-foreground">{value}</span>
                  <MetricIcon className="size-3.5 text-brand-blue" />
                </div>
                <p className="mt-1 text-[8px] text-dashboard-muted">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.25fr]">
            <div className="dashboard-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-dashboard-foreground">Submission progress</span>
                <span className="text-[9px] font-bold text-brand-blue">84%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-dashboard-soft">
                <div className="h-full w-[84%] rounded-full bg-brand-blue" />
              </div>
              <p className="mt-3 text-[8px] text-dashboard-muted">13 of 16 reports submitted</p>
            </div>
            <div className="dashboard-card p-3">
              <p className="mb-2 text-[9px] font-semibold text-dashboard-foreground">Weekly status</p>
              <div className="space-y-2">
                {team.slice(0, 3).map((member) => (
                  <div key={member.name} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-dashboard-soft text-[7px] font-bold text-brand-blue">{member.initials}</span>
                      <span className="truncate text-[8px] text-dashboard-foreground">{member.name}</span>
                    </div>
                    <StatusBadge status={member.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <div className="product-frame">
      <div className="flex items-center justify-between border-b border-dashboard-border px-5 py-4">
        <div className="flex items-center gap-3">
          <PulseMark compact />
          <div>
            <p className="text-sm font-bold text-dashboard-foreground">Team overview</p>
            <p className="text-[11px] text-dashboard-muted">Week of Sep 7–11, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="dashboard" size="sm">Export</Button>
          <span className="grid size-8 place-items-center rounded-full bg-dashboard-soft text-[10px] font-bold text-brand-blue">OD</span>
        </div>
      </div>
      <div className="bg-dashboard-canvas p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Total reports", "16", "+2 this week", FileText],
            ["Submission compliance", "84%", "+6.4%", TrendingUp],
            ["Needs correction", "2", "12.5% of reports", MessageSquareText],
            ["Open blockers", "4", "Across 3 projects", CircleAlert],
          ].map(([label, value, detail, MetricIcon]) => (
            <div key={label} className="dashboard-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-dashboard-muted">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-dashboard-foreground">{value}</p>
                </div>
                <span className="grid size-8 place-items-center rounded-md bg-dashboard-soft">
                  <MetricIcon className="size-4 text-brand-blue" />
                </span>
              </div>
              <p className="mt-3 text-[10px] text-dashboard-muted">{detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.65fr]">
          <div className="dashboard-card min-w-0 p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dashboard-foreground">Tasks completed trend</p>
                <p className="text-[10px] text-dashboard-muted">Last 7 reporting weeks</p>
              </div>
              <span className="text-[10px] font-semibold text-brand-blue">+18.4%</span>
            </div>
            <MiniChart />
            <div className="mt-2 flex justify-between text-[9px] text-dashboard-muted">
              {["W31", "W32", "W33", "W34", "W35", "W36", "W37"].map((week) => (
                <span key={week}>{week}</span>
              ))}
            </div>
          </div>
          <div className="dashboard-card p-4 sm:p-5">
            <p className="text-sm font-bold text-dashboard-foreground">Workload by project</p>
            <p className="mb-5 text-[10px] text-dashboard-muted">Hours reported this week</p>
            {[["Platform", 82], ["Mobile app", 66], ["Client portal", 48], ["Research", 31]].map(([name, width]) => (
              <div key={name} className="mb-3">
                <div className="mb-1.5 flex justify-between text-[10px]">
                  <span className="text-dashboard-foreground">{name}</span>
                  <span className="text-dashboard-muted">{width}h</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-dashboard-soft">
                  <div className="h-full rounded-full bg-brand-blue" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.65fr]">
          <div className="dashboard-card overflow-hidden">
            <div className="border-b border-dashboard-border px-4 py-3">
              <p className="text-sm font-bold text-dashboard-foreground">Submission status by team member</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="text-[9px] uppercase text-dashboard-muted">
                    <th className="px-4 py-2.5 font-medium">Team member</th>
                    <th className="px-4 py-2.5 font-medium">Tasks</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member, index) => (
                    <tr key={member.name} className="border-t border-dashboard-border text-[10px]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid size-7 place-items-center rounded-full bg-dashboard-soft font-bold text-brand-blue">{member.initials}</span>
                          <div>
                            <p className="font-semibold text-dashboard-foreground">{member.name}</p>
                            <p className="text-[9px] text-dashboard-muted">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-dashboard-foreground">{member.tasks}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-4 py-3 text-dashboard-muted">{index === 2 ? "Sep 10" : "Sep 11"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="dashboard-card p-4">
            <p className="text-sm font-bold text-dashboard-foreground">Recent activity</p>
            <div className="mt-4 space-y-4">
              {[
                ["Alex's report was approved", "12 min ago", CheckCircle2],
                ["Sam received a correction request", "46 min ago", MessageSquareText],
                ["Taylor submitted a report", "2 hrs ago", FileCheck2],
              ].map(([text, time, ActivityIcon]) => (
                <div key={text} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-dashboard-soft">
                    <ActivityIcon className="size-3.5 text-brand-blue" />
                  </span>
                  <div>
                    <p className="text-[10px] font-medium leading-4 text-dashboard-foreground">{text}</p>
                    <p className="mt-0.5 text-[9px] text-dashboard-muted">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkPulseHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="overflow-hidden bg-background">
      <section className="hero-grid relative bg-hero text-hero-foreground">
        <header className="relative z-20 mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Brand dark />
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <Link href="/login" className="nav-link">Login</Link>
            <Button asChild variant="hero" size="sm">
              <Link href="/register">Get Started <ArrowRight /></Link>
            </Button>
          </nav>
          <Button
            variant="heroGhost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
          {menuOpen && (
            <nav className="absolute left-5 right-5 top-16 rounded-lg border border-hero-border bg-hero-raised p-3 shadow-hero md:hidden" aria-label="Mobile navigation">
              {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Login", "/login"], ["Get Started", "/register"]].map(([label, href]) => (
                <Link key={label} href={href} onClick={closeMenu} className="block rounded-md px-3 py-3 text-sm font-medium text-hero-muted hover:bg-hero-soft hover:text-hero-foreground">
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </header>
        <div className="relative z-10 mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:px-10 lg:pb-24 lg:pt-16">
          <div className="max-w-xl animate-fade-up">
            <div className="hero-badge">
              <span className="size-1.5 rounded-full bg-brand-blue" />
              SMART TEAM REPORTING
            </div>
            <h1 className="mt-7 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-[4.25rem]">Turn weekly work into clear progress.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-hero-muted sm:text-lg">
              WorkPulse makes weekly reporting simple for team members and gives managers a clear view of progress, workload, blockers, and team performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link href="/register">Get Started <ArrowRight /></Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <a href="#dashboard">View Dashboard <ChevronRight /></a>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-hero-muted">
              {["Structured reports", "Fast approvals", "Clear insights"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-brand-blue" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative lg:-mr-20">
            <div className="dashboard-glow" />
            <HeroDashboard />
          </div>
        </div>
      </section>

      <section id="features" className="section-shell scroll-mt-8 bg-background">
        <div className="section-heading">
          <span>BUILT FOR CLARITY</span>
          <h2>Everything your team needs for weekly reporting.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featureCards.map(({ number, title, text, icon: Icon }) => (
            <article key={title} className="feature-card group">
              <div className="flex items-center justify-between">
                <span className="feature-icon"><Icon /></span>
                <span className="text-xs font-bold text-muted-foreground/60">{number}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              <ArrowRight className="mt-7 size-4 text-brand-blue transition-transform group-hover:translate-x-1" />
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 border-y border-border bg-surface-subtle">
        <div className="section-shell">
          <div className="section-heading">
            <span>ONE SIMPLE FLOW</span>
            <h2>Submit. Review. Improve.</h2>
          </div>
          <div className="workflow mt-14">
            {[
              ["Submit", "Team members complete and submit their weekly report.", FileText],
              ["Review", "Managers review the report and approve it or request changes.", FileCheck2],
              ["Improve", "Team members make corrections and resubmit until approved.", TrendingUp],
            ].map(([title, text, StepIcon], index) => (
              <div key={title} className="workflow-step">
                <div className="workflow-icon"><StepIcon /></div>
                <p className="mt-5 text-xs font-bold text-brand-blue">0{index + 1}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p>
                {index < 2 && <div className="workflow-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="section-shell scroll-mt-8">
        <div className="section-heading">
          <span>MANAGER OVERVIEW</span>
          <h2>See your team&apos;s work at a glance.</h2>
          <p>Know what moved forward, what needs attention, and where your team needs support.</p>
        </div>
        <div className="mt-12"><ManagerDashboard /></div>
      </section>

      <section id="get-started" className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="cta-band mx-auto max-w-7xl">
          <div>
            <p className="text-xs font-bold text-hero-accent">START THIS WEEK</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-hero-foreground sm:text-4xl">Make weekly reporting effortless.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-hero-muted sm:text-base">
              Give your team a simpler way to report progress and managers a clearer way to understand it.
            </p>
          </div>
          <Button asChild variant="hero" size="xl">
            <Link href="/register">Get Started <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <Brand dark />
              <p className="mt-3 text-sm text-white/70">Weekly reporting and team insights, simplified.</p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/70">
              {[["Login", "/login"], ["Register", "/register"], ["Dashboard", "/dashboard"], ["Reports", "/reports"]].map(([link, href]) => (
                <Link key={link} href={href} className="transition-colors hover:text-white">
                  {link}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-10 border-t border-white/15 pt-5 text-xs text-white/50">© 2026 WorkPulse. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
