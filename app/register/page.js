"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { user, loading, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "team_member" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "manager" ? "/dashboard" : "/reports");
    }
  }, [loading, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await register(form);
      router.replace(newUser.role === "manager" ? "/dashboard" : "/reports");
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-display text-lg font-bold text-foreground">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-blue">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          WorkPulse
        </Link>

        <div className="dashboard-card p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start submitting or reviewing weekly reports.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <Field label="Full name" htmlFor="name">
              <Input
                id="name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <Field label="Password" htmlFor="password" hint="At least 8 characters">
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </Field>
            <Field label="Role" htmlFor="role" hint="Choose Manager to review team reports and access the dashboard.">
              <Select
                id="role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="team_member">Team Member</option>
                <option value="manager">Manager</option>
              </Select>
            </Field>
            <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
