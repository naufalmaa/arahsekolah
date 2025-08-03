// app/dashboard/list/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSchools } from "@/lib/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin } from "lucide-react";
// import { SchoolWithStats } from "@/lib/types";

// Helper untuk menghitung jarak
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

const SchoolCardSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-2 border-t">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  </div>
);

export default function ListPage() {
  const { data: schools, isLoading, error } = useSchools();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all");
  const [filterRating, setFilterRating] = useState('all'); // State baru untuk filter rating
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  const filteredSchools = useMemo(() => {
    if (!schools) return [];

    return schools
      .map((school) => ({
        ...school,
        distance:
          userLocation && school.lat && school.lng
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                school.lat,
                school.lng
              )
            : null,
      }))
      .filter((school) => {
        const matchesSearch = school.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType =
          filterType === "all" || school.status === filterType;
        const matchesDistance =
          filterDistance === "all" ||
          (school.distance !== null &&
            school.distance <= parseInt(filterDistance));
        const matchesRating = filterRating === 'all' || school.avgRating >= parseInt(filterRating);
        return matchesSearch && matchesType && matchesDistance && matchesRating;
      });
  }, [schools, searchTerm, filterType, filterDistance, filterRating, userLocation]);

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg text-slate-700 font-medium">
            Error loading schools
          </p>
          <p className="text-slate-500 mt-2">Please try again later</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-300 sticky top-0 z-40 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900">
            Daftar Sekolah Dasar
          </h1>
          <p className="text-xl text-slate-600 mt-2">
            Cari dan bandingkan sekolah terbaik di Bandung.
          </p>

          {/* 1. Search Box dan Filter */}
          <div className="flex items-center gap-4 mt-6">
            <Input
              placeholder="Cari nama sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent className="border border-slate-300">
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Negeri">Negeri</SelectItem>
                <SelectItem value="Swasta">Swasta</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterDistance}
              onValueChange={setFilterDistance}
              disabled={!userLocation}
            >
              {/* PENAMBAHAN: Filter Average Rating */}
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Semua Rating" /></SelectTrigger>
              <SelectContent className="border border-slate-300">
                <SelectItem value="all">Semua Rating</SelectItem>
                <SelectItem value="4">&gt; 4 Bintang</SelectItem>
                <SelectItem value="3">&gt; 3 Bintang</SelectItem>
              </SelectContent>
            </Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Semua Jarak" />
              </SelectTrigger>
              <SelectContent className="border border-slate-300">
                <SelectItem value="all">Semua Jarak</SelectItem>
                <SelectItem value="1">&lt; 1 km</SelectItem>
                <SelectItem value="3">&lt; 3 km</SelectItem>
                <SelectItem value="5">&lt; 5 km</SelectItem>
                <SelectItem value="10">&lt; 10 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // PENAMBAHAN: Tampilkan skeleton saat loading
                Array.from({ length: 6 }).map((_, index) => (
                  <SchoolCardSkeleton key={index} />
                ))
              : filteredSchools.map((s) => (
                  <Card
                    key={s.id}
                    className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-300"
                    asChild
                  >
                    <Link href={`/dashboard/detail/${s.id}`}>
                      {/* 2. Thumbnail dan informasi tambahan di card */}
                      <div className="relative h-40 w-full">
                        <Image
                          src={
                            s.status === "Negeri"
                              ? "/sekolah-negeri.jpg"
                              : "/sekolah-swasta.jpg"
                          }
                          alt={s.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    <CardHeader>
                      {/* PENAMBAHAN: Badge Warna untuk Tipe Sekolah */}
                      <Badge className={`mb-2 ${s.status === 'Negeri' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {s.status}
                      </Badge>
                      <CardTitle className="truncate">{s.name}</CardTitle>
                      <CardDescription>{s.kelurahan}, {s.kecamatan}</CardDescription>
                    </CardHeader>
                      <CardContent className="flex flex-col gap-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <strong>{s.avgRating.toFixed(1)}</strong>
                            <span>({s.reviewCount})</span>
                          </div>
                          {s.distance !== null && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <strong>{s.distance} km</strong>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
          </div>
          {filteredSchools.length === 0 && !isLoading && (
            <div className="text-center col-span-full py-20">
              <p className="text-slate-500">
                Tidak ada sekolah yang cocok dengan kriteria pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
