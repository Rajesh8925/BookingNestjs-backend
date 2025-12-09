"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleLoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role") || "user";

    if (token) {
      localStorage.setItem("token", token);
      router.push(role === "admin" ? "/dashboard" : "/booking");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
