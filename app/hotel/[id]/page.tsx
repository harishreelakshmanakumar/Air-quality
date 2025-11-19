import NavBar from "@/components/NavBar";
import RoomCard from "@/components/RoomCard";
import ReviewSection from "@/components/ReviewSection";
import hotels from "@/data/hotels.json";
import rooms from "@/data/rooms.json";
import reviewsData from "@/data/reviews.json";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function HotelPage({ params }: { params: { id: string } }) {
  const hotel = hotels.find((h) => h.id === params.id);
  const hotelRooms = rooms.filter((room) => room.hotelId === params.id);
  const hotelReviews = reviewsData.find((r) => r.hotelId === params.id);

  if (!hotel) return notFound();

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-3xl">
          <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-5 left-6 text-white">
            <p className="text-sm">{hotel.location}</p>
            <h1 className="text-3xl font-semibold">{hotel.name}</h1>
            <p className="text-sm text-white/80">Rating {hotel.rating} · Eco {hotel.ecoScore} · Air {hotel.airQuality}</p>
          </div>
        </div>

        <section className="mt-8 grid gap-8 md:grid-cols-[1.2fr,0.8fr] md:items-start">
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-800">About</h2>
            <p className="mt-2 text-slate-600">{hotel.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
              {hotel.facilities.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-2">{item}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800">Sustainability & Air</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Eco score: {hotel.ecoScore}</li>
              <li>Air quality score: {hotel.airQuality}</li>
              <li>Energy: Solar + smart automation</li>
              <li>Water: Rainwater reuse, filtered taps</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Rooms</h2>
            <p className="text-sm text-slate-500">Preview in 3D or check live-like metrics.</p>
          </div>
          <div className="space-y-4">
            {hotelRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </section>

        {hotelReviews && (
          <ReviewSection reviews={hotelReviews.reviews} />
        )}
      </main>
    </div>
  );
}
