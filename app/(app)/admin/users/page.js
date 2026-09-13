"use client";

import { UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const emptyForm = { name: "", email: "", role: "team_member" };

function UserManagementContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/users", { includeInactive: "true" });
      setUsers(data.users);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleInvite = async (event) => {
    event.preventDefault();
    setError("");
    setInviteResult(null);
    setInviting(true);
    try {
      const data = await api.post("/users", form);
      setInviteResult(data);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message || "Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      load();
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
  };

  const toggleActive = async (member) => {
    const action = member.isActive ? "Deactivate" : "Reactivate";
    if (!window.confirm(`${action} ${member.name}?`)) return;
    try {
      if (member.isActive) {
        await api.delete(`/users/${member.id}`);
      } else {
        await api.patch(`/users/${member.id}/reactivate`);
      }
      load();
    } catch (err) {
      setError(err.message || `Failed to ${action.toLowerCase()} user`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">User management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invite team members, assign roles, and manage access.</p>
      </div>

      <div className="dashboard-card p-5">
        <h2 className="font-display text-base font-bold text-foreground">Invite a user</h2>
        {error && <Alert tone="error" className="mt-3">{error}</Alert>}
        {inviteResult && (
          <Alert tone="success" className="mt-3">
            <span className="font-semibold">{inviteResult.user.name}</span> was created. Share this temporary
            password so they can log in and change it: <span className="font-mono font-semibold">{inviteResult.temporaryPassword}</span>
          </Alert>
        )}
        <form onSubmit={handleInvite} className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Name" htmlFor="invite-name">
            <Input id="invite-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Email" htmlFor="invite-email">
            <Input
              id="invite-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Role" htmlFor="invite-role">
            <Select id="invite-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="team_member">Team Member</option>
              <option value="manager">Manager</option>
            </Select>
          </Field>
          <div className="sm:col-span-3">
            <Button type="submit" variant="hero" disabled={inviting}>
              <UserPlus className="size-4" /> {inviting ? "Inviting…" : "Invite user"}
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {users.map((member) => (
                  <tr key={member.id} className="border-b border-dashboard-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                    <td className="px-4 py-3">
                      <Select
                        className="w-36"
                        value={member.role}
                        onChange={(e) => changeRole(member.id, e.target.value)}
                        disabled={member.id === currentUser.id}
                      >
                        <option value="team_member">Team Member</option>
                        <option value="manager">Manager</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={member.isActive ? "status-approved rounded-full px-2.5 py-1 text-xs font-semibold" : "status-draft rounded-full px-2.5 py-1 text-xs font-semibold"}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {member.id !== currentUser.id && (
                        <button
                          onClick={() => toggleActive(member)}
                          className="text-sm font-semibold text-brand-blue hover:underline"
                        >
                          {member.isActive ? "Deactivate" : "Reactivate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <RequireRole role="manager">
      <UserManagementContent />
    </RequireRole>
  );
}
