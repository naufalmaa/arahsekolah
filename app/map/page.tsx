// File: app/map/page.tsx

import { prisma } from "@/lib/prisma";
import MapClient from "@/components/dashboard/MapClient";

export default async function MapPage() {
  const schools = await prisma.school.findMany({
    include: { reviews: true } // CORRECTED: Include reviews to compute the average rating
  });

  const schoolsWithRating = schools.map(s => ({
    ...s,
    avgRating: s.reviews.length ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length : 0
  }));

  return (
    <div className="map-page">
      {/* CORRECTED: Render the client component and pass the data as a prop. */}
      <MapClient schoolsWithRating={schoolsWithRating} />
    </div>
  );
}