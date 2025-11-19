import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  ecoScore: number;
  airQuality: number;
  image: string;
  tagline?: string;
};

export default function HotelCard({ id, name, location, rating, price, ecoScore, airQuality, image, tagline }: Props) {
  return (
    <div className="card flex h-full flex-col gap-3">
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <Image src={image} alt={name} fill className="object-cover" />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
          {location}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2 text-xs font-semibold text-white">
          <span className="rounded-full bg-black/50 px-2 py-1">Eco {ecoScore}</span>
          <span className="rounded-full bg-black/50 px-2 py-1">Air {airQuality}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{rating} ★</p>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          {tagline && <p className="text-sm text-slate-500">{tagline}</p>}
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">from</div>
          <div className="text-xl font-semibold text-slate-800">₹{price}</div>
          <div className="text-xs text-slate-500">per night</div>
        </div>
      </div>
      <Link
        href={`/hotel/${id}`}
        className="mt-2 inline-flex justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
      >
        View hotel
      </Link>
    </div>
  );
}
