'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("Erode");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location) query.set("location", location);
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    router.push(`/search?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl bg-white p-4 shadow-card border border-slate-100 sm:grid-cols-[1.5fr,1fr,1fr,auto]"
    >
      <div>
        <label className="text-xs font-semibold text-slate-500">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search by city or island"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500">Check-out</label>
        <div className="flex gap-2 mt-1">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="hidden sm:flex items-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
        >
          Search
        </button>
      </div>
      <button
        type="submit"
        className="sm:hidden inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
      >
        Search
      </button>
    </form>
  );
}
