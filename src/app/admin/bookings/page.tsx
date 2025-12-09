"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import styles from "./adminbookings.module.css";
import {
  Booking,
  AdminBookingsResponse,
  UpdateBookingResponse,
} from "@/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get<AdminBookingsResponse>("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
      setEditingBooking(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update booking");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Bookings</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Date</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.customerName}</td>
              <td>{b.phone}</td>
              <td>{b.service}</td>
              <td>{b.date}</td>
              <td>{b.userId}</td>
              <td>
                <button onClick={() => setEditingBooking(b)}>Edit</button>
                <button onClick={() => handleDelete(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Separate Popup Modal */}
      {editingBooking && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Booking</h3>
            <input
              type="text"
              value={editingBooking.customerName}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking, customerName: e.target.value })
              }
            />
            <input
              type="text"
              value={editingBooking.phone}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking, phone: e.target.value })
              }
            />
            <input
              type="text"
              value={editingBooking.service}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking, service: e.target.value })
              }
            />
            <input
              type="date"
              value={editingBooking.date}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking, date: e.target.value })
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
