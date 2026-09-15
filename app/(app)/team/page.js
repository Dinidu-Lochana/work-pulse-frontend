"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Alert } from "@/components/ui/Alert";
import { PageLoader } from "@/components/ui/Spinner";
import { api } from "@/lib/api";

function TeamPageContent() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users", { role: "team_member" })
      .then((data) => setMembers(data.users))
      .catch((err) => setError(err.message || "Failed to load team members"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">Open a team member to see their full report history.</p>
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      {members.length === 0 ? (
        <div className="dashboard-card p-10 text-center text-sm text-muted-foreground">No team members yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.id}`}
              className="dashboard-card flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dashboard-soft text-sm font-bold text-brand-blue">
                {member.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <RequireRole role="manager">
      <TeamPageContent />
    </RequireRole>
  );
}
