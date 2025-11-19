import NavBar from "@/components/NavBar";
import SectionTitle from "@/components/SectionTitle";
import HotelCard from "@/components/HotelCard";
import hotels from "@/data/hotels.json";

export default function SearchPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const location = typeof searchParams.location === "string" ? searchParams.location : "";
  
  let filtered = hotels;
  let title = "All Stays";
  let description = "Browse properties, check eco data, and jump into 3D previews.";

  if (location === "eco") {
    // Filter by eco-friendliness: high eco score and air quality
    filtered = hotels
      .filter((hotel) => hotel.ecoScore >= 88 && hotel.airQuality >= 85)
      .sort((a, b) => (b.ecoScore + b.airQuality) - (a.ecoScore + a.airQuality));
    title = "Eco-Friendly Picks";
    description = "Top-rated sustainable hotels with excellent air quality and eco scores.";
  } else if (location === "erode") {
    // Show all hotels in Erode
    filtered = hotels;
    title = "All Stays in Erode";
  } else if (location) {
    // Search by location text
    filtered = hotels.filter((hotel) => 
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );
    title = filtered.length > 0 ? `Stays in ${location}` : `No matches for "${location}"`;
  }

  const hasResults = filtered.length > 0;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <SectionTitle
          title={title}
          description={description}
        />
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {hasResults ? (
            filtered.map((hotel) => (
              <div key={hotel.id} className="h-full">
                <HotelCard {...hotel} />
              </div>
            ))
          ) : (
            <div className="card">Try a nearby area like Perundurai, Karungalpalayam, Pallipalayam, or Thindal.</div>
          )}
        </div>
      </main>
    </div>
  );
}
