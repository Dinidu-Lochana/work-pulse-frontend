"use client";

import { useCallback, useEffect, useState } from "react";

import { api } from "@/lib/api";

export function useProjects({ includeInactive = false } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/projects", includeInactive ? { includeInactive: "true" } : undefined);
      setProjects(data.projects);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    load();
  }, [load]);

  return { projects, loading, error, reload: load };
}
