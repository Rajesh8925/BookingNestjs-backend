"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import styles from "./login.module.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface LoginForm {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name?: string;
  email: string;
  role: "user" | "admin";
}

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Normal login
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 👇 No Authorization header here
      const res = await API.post<LoginResponse>(
        "/auth/login",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      const data: LoginResponse = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") router.push("/dashboard");
      else router.push("/booking");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid login details");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post<LoginResponse>(
        "/auth/google-sso",
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      const data: LoginResponse = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") router.push("/dashboard");
      else router.push("/booking");
    } catch (err: any) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        {error && <p className={styles.error}>{error}</p>}

        {/* Email/Password Login */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={styles.input}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        <button
          onClick={handleLogin}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Login */}
        <div style={{ marginTop: "10px" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </div>

        <p className={styles.bottomText}>
          Don't have an account?{" "}
          <a href="/signup" className={styles.link}>
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
