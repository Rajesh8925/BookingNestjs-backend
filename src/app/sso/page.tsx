"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.push("/booking"); // or /dashboard based on role
    }
  }, [router]);

  return <p>Logging in with Google...</p>;
}
