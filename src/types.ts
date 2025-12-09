// src/types.ts

export interface Booking {
  _id: string;
  customerName: string;
  phone: string;
  service: string;
  date: string;
  userId?: string; // optional for dashboard
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AdminBookingsResponse {
  message: string;
  bookings: Booking[];
}

export type UserBookingsResponse = Booking[];

export interface UpdateBookingResponse {
  message: string;
  booking: Booking;
}
