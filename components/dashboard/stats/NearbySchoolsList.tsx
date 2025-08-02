// file: components/dashboard/stats/NearbySchoolsList.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface School {
  id: number;
  name: string;
  alamat: string;
  distance: number;
}

export const NearbySchoolsList = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `/api/schools/nearby?lat=${latitude}&lng=${longitude}`
          );
          if (!res.ok) throw new Error("Gagal memuat sekolah terdekat.");
          const data = await res.json();
          setSchools(data);
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan tidak dikenal";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Akses lokasi ditolak. Aktifkan untuk melihat sekolah terdekat."
        );
        setLoading(false);
      }
    );
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-full w-full" />
          ))}
        </div>
      );
    }
    if (error) {
      return <p className="text-sm text-red-600 text-center py-4">{error}</p>;
    }
    if (schools.length === 0) {
      return (
        <p className="text-sm text-slate-500 text-center py-4">
          Tidak ada sekolah ditemukan di sekitar Anda.
        </p>
      );
    }
    return (
      <div className="space-y-3">
        {schools.map((school) => (
          <Link href={`/dashboard/detail/${school.id}`} key={school.id}>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">{school.name}</p>
                <p className="text-xs text-slate-500">{school.alamat}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">
                  {school.distance} km
                </p>
                <p className="text-xs text-slate-400">dari sini</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-slate-500" />
              Sekolah Terdekat
            </CardTitle>
            <CardDescription className="text-slate-600">
              Berdasarkan lokasi Anda saat ini.
            </CardDescription>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/map">
              Lihat Peta <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-6">{renderContent()}</CardContent>
    </Card>
  );
};
