"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app/AppShell";
import { PageLoader } from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth-context";

export default function AppLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return <PageLoader />;

  return <AppShell>{children}</AppShell>;
}
