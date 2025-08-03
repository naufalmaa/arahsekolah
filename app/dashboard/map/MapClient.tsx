// app/dashboard/map/MapClient.tsx
"use client";
"use client";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, School as SchoolIcon, LocateFixed } from "lucide-react";

// Tipe data sekolah yang diperkaya
type School = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "Negeri" | "Swasta";
  avgRating: number;
  reviewCount: number;
};

// Custom Icon untuk Sekolah Negeri
const schoolIconNegeri = new L.DivIcon({
  html: `
    <div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom Icon untuk Sekolah Swasta
const schoolIconSwasta = new L.DivIcon({
  html: `
    <div style="background-color: #16a34a; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom Icon untuk Lokasi Pengguna
const userLocationIcon = new L.DivIcon({
  html: `<div style="width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); border: 2px solid white; animation: pulse 2s infinite;"></div><style>@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }</style>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper untuk menghitung jarak
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // Jarak dalam km dengan 1 desimal
}

// Komponen untuk mengontrol peta (zoom, dsb)
// FIX: Komponen ini sekarang akan bereaksi terhadap state dan mengontrol peta
function MapEventsController({ zoomTarget }: { zoomTarget: L.LatLngExpression | null }) {
    const map = useMap();

    useEffect(() => {
        if (zoomTarget) {
            // Skala 1cm:5km kira-kira setara dengan zoom level 12 di Leaflet
            map.flyTo(zoomTarget, 15, {
                animate: true,
                duration: 1.5,
            });
        }
    }, [zoomTarget, map]);

    return null;
}

// Base map options
const baseMaps = [
  {
    name: "Street Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    name: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
];

export default function MapClient() {
  const [schools, setSchools] = useState<School[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState(0);
  const [showBaseMaps, setShowBaseMaps] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<L.LatLngExpression | null>(null);
  const { data: session } = useSession();

  // 1. Meminta izin lokasi saat komponen dimuat
  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then(setSchools);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(
            "Izin lokasi ditolak. Fitur jarak tidak akan berfungsi."
          );
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  const handleZoomToLocation = () => {
    if (userLocation) {

        setZoomTarget([userLocation.lat, userLocation.lng]);
    } else {
        alert("Lokasi Anda belum ditemukan. Mohon izinkan akses lokasi.");
    }
  };

  return (
    <div className="relative h-full min-h-screen">
      {/* Base Map Selector */}
      <div className="absolute top-33 left-3 z-[1000]">
        <Button
          onClick={() => setShowBaseMaps(!showBaseMaps)}
          variant={"outline"}
          className="border-none"
        >
          <svg
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          {baseMaps[selectedBaseMap].name}
        </Button>

        {showBaseMaps && (
          <div className="absolute top-full mt-2 left-0 bg-white/95 backdrop-blur-md rounded-md shadow-xl border border-slate-200 overflow-hidden min-w-full">
            {baseMaps.map((baseMap, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedBaseMap(index);
                  setShowBaseMaps(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-slate-500 transition-colors duration-200 font-medium ${
                  selectedBaseMap === index
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-900 text-slate-100"
                }`}
              >
                {baseMap.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="absolute top-22 left-3 z-[1000] flex flex-col gap-2">
        {/* 2. Tombol Zoom ke Lokasi Pengguna */}
        <Button
          onClick={handleZoomToLocation}
          disabled={!userLocation}
          className="shadow-lg"
        >
          <LocateFixed className="w-5 h-5 mr-2" />
          Zoom to Me
        </Button>
        {locationError && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md text-sm shadow-md">
            {locationError}
          </div>
        )}
      </div>
                  {/* Legenda Peta */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200">
        <h4 className="font-bold text-sm mb-2 text-slate-800">Legenda</h4>
        <ul className="space-y-2 text-sm text-slate-700 flex flex-col gap-2">
          <li className="flex items-center gap-2">
            <div dangerouslySetInnerHTML={{ __html: schoolIconNegeri.options.html || '' }} />
            <span>Sekolah Negeri</span>
          </li>
          <li className="flex items-center gap-2">
            <div dangerouslySetInnerHTML={{ __html: schoolIconSwasta.options.html || '' }} />
            <span>Sekolah Swasta</span>
          </li>
          <li className="flex items-center gap-2 p-1">
            <div
            className="mr-1"
            dangerouslySetInnerHTML={{ __html: userLocationIcon.options.html || '' }} />
            <span>Lokasi Anda</span>
          </li>
        </ul>
      </div>

      <MapContainer
        center={[-6.914744, 107.60981]}
        zoom={13}
        className="h-full min-h-screen"
      >
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' /> */}
        <TileLayer
          url={baseMaps[selectedBaseMap].url}
          attribution={baseMaps[selectedBaseMap].attribution}
        />
        <MapEventsController zoomTarget={zoomTarget} />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {schools.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            // 4. Marker dibedakan berdasarkan status
            icon={s.status === "Negeri" ? schoolIconNegeri : schoolIconSwasta}
          >
            {/* 3. Popup yang sudah diperkaya */}
            <Popup minWidth={280}>
              <div className="p-1">
                <div className="relative h-32 w-full mb-2">
                  <Image
                    src={
                      s.status === "Negeri"
                        ? "/sekolah-negeri.jpg"
                        : "/sekolah-swasta.jpg"
                    }
                    alt={s.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{s.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>
                    {s.avgRating.toFixed(1)} ({s.reviewCount} ulasan)
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      s.status === "Negeri"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {s.status}
                  </span>
                  {userLocation && (
                    <span className="font-medium text-gray-700">
                      {calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        s.lat,
                        s.lng
                      )}{" "}
                      km
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className=" w-full" >
                    <Link 
                    
                    href={`/dashboard/detail/${s.id}`}><p className="text-slate-100">Lihat Detail</p></Link>
                  </Button>
                  {session?.user.role === "USER" && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/dashboard/detail/${s.id}?action=review`}>
                        Beri Ulasan
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
