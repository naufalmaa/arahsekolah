// File: app/map/page.tsx

import { prisma } from "@/lib/prisma";
import MapClient from "@/components/dashboard/MapClient";

export default async function MapPage() {
  const schools = await prisma.school.findMany({
    include: { reviews: true }
  });

  const schoolsWithRating = schools.map(s => ({
    ...s,
    avgRating: s.reviews.length 
      ? s.reviews.reduce((sum, r) => {
          // Calculate average of the 4 rating components for each review
          const reviewAvg = (r.kenyamanan + r.pembelajaran + r.fasilitas + r.kepemimpinan) / 4;
          return sum + reviewAvg;
        }, 0) / s.reviews.length 
      : 0
  }));

  return (
    <div className="map-page">
      <MapClient schoolsWithRating={schoolsWithRating} />
    </div>
  );
}