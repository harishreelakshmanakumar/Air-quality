import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  size: string;
  beds: string;
  price: number;
  description?: string;
  image: string;
};

export default function RoomCard({ id, name, size, beds, price, description, image }: Props) {
  return (
    <div className="card flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative h-40 w-full overflow-hidden rounded-xl sm:w-56">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary">{size} · {beds}</p>
            <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">from</div>
          <div className="text-xl font-semibold text-slate-800">₹{price}</div>
        </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/room/${id}/3d`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary">
            View in 3D
          </Link>
          <Link href={`/room/${id}/metrics`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary">
            View Metrics
          </Link>
          <Link href={`/booking/${id}`} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700">
            Book now
          </Link>
        </div>
      </div>
    </div>
  );
}
