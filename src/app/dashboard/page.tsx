"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import styles from "./dashboard.module.css";
import {
  Booking,
  User,
  AdminBookingsResponse,
  UserBookingsResponse,
  UpdateBookingResponse,
} from "@/types";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Fetch bookings depending on role
  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) throw new Error("User not authenticated");

      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.role === "admin") {
        const res = await API.get<AdminBookingsResponse>("/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } else {
        const res = await API.get<UserBookingsResponse>("/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Defensive: handle both array and object response
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data as any).bookings || [];
        setBookings(data);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Delete booking
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete booking");
    }
  };

  // Save edited booking
  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    try {
      const token = localStorage.getItem("token");
      const res = await API.patch<UpdateBookingResponse>(
        `/bookings/${editingBooking._id}`,
        editingBooking,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(
        bookings.map((b) =>
          b._id === editingBooking._id ? res.data.booking : b
        )
      );
      setEditingBooking(null); // close popup
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update booking");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subText}>
        Welcome, {user.name} ({user.role})
      </p>

      {bookings.length === 0 && <p>No bookings found.</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Date</th>
            {user.role === "admin" && <th>User ID</th>}
            {user.role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) &&
            bookings.map((b, i) => (
              <tr
                key={b._id}
                className={i % 2 === 0 ? styles.tableRowEven : ""}
              >
                <td>{b.customerName}</td>
                <td>{b.phone}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                {user.role === "admin" && <td>{b.userId}</td>}
                {user.role === "admin" && (
                  <td>
                    <button onClick={() => setEditingBooking(b)}>Edit</button>
                    <button onClick={() => handleDelete(b._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Popup Modal for Editing */}
      {editingBooking && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Booking</h3>
            <input
              type="text"
              value={editingBooking?.customerName ?? ""}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking!,
                  customerName: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editingBooking?.phone ?? ""}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking!, phone: e.target.value })
              }
            />
            <input
              type="text"
              value={editingBooking?.service ?? ""}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking!,
                  service: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={editingBooking?.date ?? ""}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking!, date: e.target.value })
              }
            />
            <div className={styles.actions}>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingBooking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
