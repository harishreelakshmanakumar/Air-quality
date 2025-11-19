'use client';

import NavBar from "@/components/NavBar";
import BookingForm from "@/components/BookingForm";
import rooms from "@/data/rooms.json";
import hotels from "@/data/hotels.json";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function BookingPage({ params }: { params: { roomId: string } }) {
  const room = rooms.find((r) => r.id === params.roomId);
  const hotel = room ? hotels.find((h) => h.id === room.hotelId) : null;

  if (!room || !hotel) return notFound();

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
        <h1 className="text-2xl font-semibold text-slate-800">Complete Your Booking</h1>
        <p className="text-sm text-slate-500 mt-1">Secure your eco-friendly stay at {hotel.name}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr,1.2fr] md:items-start">
          {/* Room Summary */}
          <div className="card sticky top-4">
            <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4">
              <Image src={room.image} alt={room.name} fill className="object-cover" />
            </div>
            
            <p className="text-xs uppercase tracking-wide text-primary">Your Selection</p>
            <h3 className="text-lg font-semibold text-slate-800 mt-1">{room.name}</h3>
            <p className="text-sm text-slate-600">{hotel.name}</p>
            <p className="text-sm text-slate-500 mt-1">{room.beds} · {room.size}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Price per night</span>
                <span className="text-xl font-bold text-primary">₹{room.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">What's Included</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Live environmental monitoring
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Premium eco-friendly amenities
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free cancellation up to 24hrs
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <BookingForm 
            roomId={room.id}
            roomName={room.name}
            roomPrice={room.price}
            hotelName={hotel.name}
          />
        </div>
      </main>
    </div>
  );
}
