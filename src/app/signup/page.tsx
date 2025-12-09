"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import API from "@/lib/axios";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", form);

      // Redirect to login with a query param to indicate redirect after login
      router.push("/login?redirect=booking");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create Account</h1>

        {error && <p className={styles.error}>{error}</p>}

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />

        <button onClick={submit} disabled={loading} className={styles.button}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className={styles.footer}>
          Already have an account? <a href="/login" className={styles.link}>Login</a>
        </p>
      </div>
    </div>
  );
}
