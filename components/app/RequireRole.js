"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PageLoader } from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth-context";

export function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== role) {
      router.replace(user.role === "manager" ? "/dashboard" : "/reports");
    }
  }, [loading, user, role, router]);

  if (loading || !user || user.role !== role) return <PageLoader />;

  return children;
}
