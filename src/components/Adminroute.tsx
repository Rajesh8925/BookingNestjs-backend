"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRequireAuth() {
  const router = useRouter();
  const { user, loadUser } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await loadUser();
      }
      if (!user) {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [user, loadUser, router]);

  return { user, loading };
}
