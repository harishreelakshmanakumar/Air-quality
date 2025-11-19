"use client";

import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/90 border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button 
          onClick={() => router.push("/")} 
          className="flex items-center gap-2 font-semibold text-slate-800 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="h-9 w-9 rounded-full bg-primary/10 grid place-items-center text-primary font-bold">WK</span>
          <div className="leading-tight">
            <div>WAKENS</div>
            <div className="text-xs text-slate-500">Erode stays · 3D & metrics</div>
          </div>
        </button>
        <nav className="hidden items-center gap-4 text-sm text-slate-600 sm:flex">
          <button onClick={() => router.push("/search?location=erode")} className="hover:text-primary">Destinations</button>
          <button onClick={() => router.push("/search?location=eco")} className="hover:text-primary">Eco picks</button>
          <button onClick={() => router.push("/")} className="hover:text-primary">Support</button>
        </nav>
        <button
          onClick={() => router.push("/admin")}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
        >
          Admin Dashboard
        </button>
      </div>
    </header>
  );
}
