// file: app/dashboard/stats/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { StatisticCard } from "@/components/dashboard/stats/StatisticCard";
import { RecentReviewsTable } from "@/components/dashboard/stats/RecentReviewsTable";
import { NearbySchoolsList } from "@/components/dashboard/stats/NearbySchoolsList";
import { Users, School, Star, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


interface ReviewItem {
  id: number;
  createdAt: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
  user: { name: string };
  school: { name: string };
}

interface ApiResponse {
  userCount?: number;
  schoolCount?: number;
  reviewCount?: number;
  recentReviews?: ReviewItem[];
  userSignups?: Array<{ month: string; count: number }>;
  schoolName?: string;
  averageRating?: number;
  profileCompleteness?: number;
  overallAvgRatingRecents?: number;
  recentUserReviews?: ReviewItem[];
  error?: string;
}

// Dynamic import for the chart component to avoid SSR issues
const UserGrowthChart = dynamic(
  () =>
    import("@/components/dashboard/stats/UserGrowthChart").then(
      (mod) => mod.UserGrowthChart
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[350px] w-full col-span-1 lg:col-span-2" />
    ),
  }
);

export default function DashboardStatsPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/stats");
          const data: ApiResponse = await res.json();
          if (res.ok) {
            setStats(data);
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error("Failed to fetch stats", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [status]);

  if (status === "loading" || (loading && status !== "unauthenticated")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="space-y-4 mt-6">
            <Skeleton className="h-10 bg-slate-200 rounded w-1/3" />
            <Skeleton className="h-6 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Skeleton className="h-32 bg-slate-200 rounded-3xl" />
            <Skeleton className="h-32 bg-slate-200 rounded-3xl" />
            <Skeleton className="h-32 bg-slate-200 rounded-3xl" />
          </div>
          <Skeleton className="h-96 bg-slate-200 rounded-3xl mt-6" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // or a redirect/login prompt
  }

  const renderDashboard = () => {
    switch (session.user.role) {
      case "SUPERADMIN":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatisticCard
                title="Total Pengguna"
                value={stats?.userCount || 0}
                icon={<Users className="h-5 w-5" />}
                loading={!stats}
              />
              <StatisticCard
                title="Total Sekolah"
                value={stats?.schoolCount || 0}
                icon={<School className="h-5 w-5" />}
                loading={!stats}
              />
              <StatisticCard
                title="Total Ulasan"
                value={stats?.reviewCount || 0}
                icon={<Star className="h-5 w-5" />}
                loading={!stats}
              />
            </div>
            <div className="mt-6">
              <UserGrowthChart
                data={stats?.userSignups || []}
                loading={!stats}
              />
            </div>
            <div className="mt-6">
              <RecentReviewsTable
                reviews={stats?.recentReviews || []}
                title="Ulasan Terbaru Platform"
                description="5 ulasan terakhir yang masuk dari seluruh sekolah."
                loading={!stats}
              />
            </div>
          </div>
        );
      case "SCHOOL_ADMIN":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatisticCard
                title="Total Ulasan"
                value={stats?.reviewCount || 0}
                icon={<Star className="h-5 w-5" />}
                loading={!stats}
              />
              <StatisticCard
                title="Rating Rata-rata"
                value={`${stats?.averageRating || 0} / 5.0`}
                icon={<BarChart3 className="h-5 w-5" />}
                loading={!stats}
              />
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Kelengkapan Profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={stats?.profileCompleteness || 0}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {stats?.profileCompleteness || 0}% data penting telah
                    terisi.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <RecentReviewsTable
                reviews={stats?.recentReviews || []}
                title="Ulasan Terbaru Sekolah Anda"
                description={`5 ulasan terakhir untuk ${stats?.schoolName}.`}
                loading={!stats}
              />
            </div>
          </div>
        );
      case "USER":
        return (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left side: StatisticCards + Reviews Table (takes col-span-2) */}
  <div className="lg:col-span-2 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatisticCard
        title="Total Ulasan Anda"
        value={stats?.reviewCount || 0}
        icon={<Star className="h-5 w-5" />}
        loading={!stats}
      />
      <StatisticCard
        title="Rating rata-rata Anda"
        value={`${stats?.overallAvgRatingRecents || 0} / 5.0`}
        icon={<School className="h-5 w-5" />}
        loading={!stats}
      />
    </div>

          <div className="mt-6">
    <RecentReviewsTable
      reviews={stats?.recentUserReviews || []}
      title="Aktivitas Ulasan Saya"
      description="5 ulasan terakhir yang telah Anda berikan."
      loading={!stats}
    />
    </div>
  </div>

  {/* Right side: Nearby Schools List spans both rows */}
  <div className="h-full">
    <NearbySchoolsList />
  </div>
</div>
        );
      default:
        return <p>Dashboard tidak tersedia untuk role Anda.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">
            Dashboard Statistik
          </h1>
          <p className="text-lg text-slate-600 mt-1">
            {session.user.role === "SCHOOL_ADMIN"
              ? `Dashboard untuk ${stats?.schoolName}`
              : `Selamat datang kembali, ${session.user.name}!`}
          </p>
        </div>
        {renderDashboard()}
      </div>
    </div>
  );
}
