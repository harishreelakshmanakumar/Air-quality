'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

type BookingData = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomName: string;
  roomPrice: number;
  hotelName: string;
  roomId: string;
  paymentMethod: string;
  bookingId: string;
};

export default function BookingSuccessPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
      sessionStorage.removeItem('bookingData');
    }
  }, []);

  if (!bookingData) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 pb-12 pt-16 text-center">
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Booking confirmed</div>
          <h1 className="text-3xl font-semibold text-slate-800">You're all set!</h1>
          <p className="text-slate-600">Thank you for exploring the eco-friendly hotel demo.</p>
          <Link
            href="/"
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
          >
            Go to home
          </Link>
        </main>
      </div>
    );
  }

  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalAmount = calculateNights() * bookingData.roomPrice;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 pb-12 pt-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600">Your eco-friendly stay has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">Booking ID</p>
              <p className="text-2xl font-mono font-bold text-slate-800 mt-1">{bookingData.bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Payment Method</p>
              <p className="text-lg font-semibold text-slate-800 mt-1">{bookingData.paymentMethod}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">Guest Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-medium text-slate-800">{bookingData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-800">{bookingData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-medium text-slate-800">{bookingData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Guests:</span>
                  <span className="font-medium text-slate-800">{bookingData.guests}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">Stay Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Hotel:</span>
                  <span className="font-medium text-slate-800">{bookingData.hotelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Room:</span>
                  <span className="font-medium text-slate-800">{bookingData.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Check-in:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(bookingData.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Check-out:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(bookingData.checkOut).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Nights:</span>
                  <span className="font-medium text-slate-800">{calculateNights()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-800">Total Amount Paid</span>
              <span className="text-3xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="card bg-blue-50 border-blue-200 mb-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-900">Confirmation Email Sent</p>
              <p className="text-sm text-blue-800 mt-1">
                We've sent a confirmation email to <span className="font-medium">{bookingData.email}</span> with your booking details and check-in instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-slate-800">Check your email</p>
                <p className="text-sm text-slate-600">Your booking confirmation and check-in details have been sent</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-slate-800">View live environmental metrics</p>
                <p className="text-sm text-slate-600">Monitor real-time air and water quality for your room</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-slate-800">Arrive and enjoy</p>
                <p className="text-sm text-slate-600">Check in and experience sustainable luxury</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href={`/room/${bookingData.roomId}/metrics`}
            className="flex-1 text-center rounded-xl border-2 border-primary text-primary px-6 py-3 font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            View Room Metrics
          </Link>
          <Link
            href="/"
            className="flex-1 text-center rounded-xl bg-primary text-white px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
