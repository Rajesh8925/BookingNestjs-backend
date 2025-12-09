// src/hooks/useRequireAuth.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRequireAuth() {
  const router = useRouter();
  const { user, loadUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await loadUser();
      }
      if (!user) {
        router.push("/login"); // redirect if not logged in
      }
    };
    checkAuth();
  }, [user, loadUser, router]);
}
