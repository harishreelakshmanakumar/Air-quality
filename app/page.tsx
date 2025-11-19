import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import HotelCard from "@/components/HotelCard";
import hotels from "@/data/hotels.json";
import Link from "next/link";

export default function HomePage() {
  const popular = hotels.slice(0, 3);
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <section className="grid gap-6 sm:grid-cols-[1.3fr,1fr] sm:items-start">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold text-primary">WAKENS demo</p>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Smart, eco-friendly stays around Erode</h1>
            <p className="text-lg text-slate-600">Search local picks, preview rooms in 3D, and review air, water, and comfort metrics before you book.</p>
            <SearchBar />
            <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
              <span className="rounded-full bg-white px-3 py-2 shadow-card border border-slate-100">HEPA-filtered rooms</span>
              <span className="rounded-full bg-white px-3 py-2 shadow-card border border-slate-100">Low CO₂ alerting</span>
              <span className="rounded-full bg-white px-3 py-2 shadow-card border border-slate-100">Solar & rainwater reuse</span>
            </div>
          </div>
          <div className="card flex h-full flex-col justify-between gap-4 bg-gradient-to-br from-white via-sky-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Popular now</h3>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary/80 border border-slate-100">Top picks</div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {popular.map((hotel) => (
                <Link key={hotel.id} href={`/hotel/${hotel.id}`} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-slate-100 hover:border-primary">
                  <div>
                    <p className="text-xs text-slate-500">{hotel.location}</p>
                    <p className="font-semibold text-slate-800">{hotel.name}</p>
                    <p className="text-xs text-slate-500">Eco {hotel.ecoScore} · Air {hotel.airQuality}</p>
                  </div>
                  <div className="text-right text-sm text-slate-700">₹{hotel.price}<span className="text-xs text-slate-500">/nt</span></div>
                </Link>
              ))}
            </div>
            <Link href="/search?location=popular" className="text-sm font-semibold text-primary">See all destinations →</Link>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Popular Destinations" description="Curated stays with clean air scores and green practices" />
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {popular.map((hotel) => (
              <HotelCard key={hotel.id} {...hotel} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle title="Eco-friendly Picks" description="Top-rated rooms with low CO₂, good light, and quiet nights" action={<Link className="text-sm font-semibold text-primary" href="/search?location=eco">View list →</Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {["Rainforest views", "Solar powered", "Greywater reuse", "HEPA filtration", "Noise-shielded", "Smart blinds"].map((item) => (
              <div key={item} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item}</p>
                  <p className="text-xs text-slate-500">Featured in multiple rooms this week</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Eco</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
