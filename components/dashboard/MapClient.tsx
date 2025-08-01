// File: app/map/MapClient.tsx
"use client"; // CORRECTED: This directive is essential to make this a Client Component.

import { Suspense } from "react";
import dynamic from "next/dynamic";

// CORRECTED: The dynamic import is moved here, where it belongs.
const SchoolMap = dynamic(() => import("@/components/SchoolMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface MapClientProps {
  schoolsWithRating: unknown[]; // Use a more specific type if possible
}

export default function MapClient({ schoolsWithRating }: MapClientProps) {
  return (
    <Suspense fallback={<p>Loading map...</p>}>
      <SchoolMap schools={schoolsWithRating} />
    </Suspense>
  );
}