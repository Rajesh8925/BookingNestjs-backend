"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import styles from "./booking.module.css";

interface BookingResponse {
  message: string;
  booking?: {
    _id: string;
    customerName: string;
    phone: string;
    service: string;
    date: string;
    userId?: string;
  };
}

interface User {
  _id: string;
  name?: string;
  email: string;
  role: "user" | "admin";
}

export default function BookingPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User not authenticated");

      const parsedUser: User = JSON.parse(storedUser);

      const res = await API.post<BookingResponse>("/bookings", {
        customerName,
        phone,
        service,
        date,
        userId: parsedUser._id,
      });

      const data: BookingResponse = res.data;
      alert(data.message || "Booking created successfully");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.bookingContainer}>
      <h2 className={styles.heading}>Create Booking</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book"}
        </button>
      </form>
    </div>
  );
}
