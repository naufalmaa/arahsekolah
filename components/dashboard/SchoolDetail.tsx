// File: components/dashboard/SchoolDetail.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditSchoolForm from "./EditSchoolForm";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import DetailPageSkeleton from "@/components/skeletons/DetailPageSkeleton";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchSchoolById } from "@/redux/schoolSlice";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DynamicSchoolMap = dynamic(() => import("@/components/dashboard/SchoolMap"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-slate-100 rounded-2xl animate-pulse" />,
});

interface SchoolDetailProps {
  schoolId: number;
}

export default function SchoolDetail({ schoolId }: SchoolDetailProps) {
  // const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] = useState(false);
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const {
    selected: school,
    loading,
    error,
  } = useAppSelector((state) => state.school);

  useEffect(() => {
    if (schoolId) {
      dispatch(fetchSchoolById(schoolId));
    }
  }, [dispatch, schoolId]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isAdminOrSuperadmin =
    session?.user?.role === "SUPERADMIN" ||
    session?.user?.role === "SCHOOL_ADMIN";

  if (loading || !school) return <DetailPageSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
          <p className="text-red-700 font-semibold text-lg">
            Error loading school details
          </p>
          <p className="text-slate-600 mt-2">
            {error || "Could not load school details."}
          </p>
        </div>
      </div>
    );
  }

  // FIX: Gunakan nullish coalescing operator (??) untuk memberikan nilai default
  const avgRating = school.avgRating ?? 0.0;
  const reviewCount = school.reviewCount ?? 0;

  return (
    <div className="space-y-8">
      {/* Hero Header Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl overflow-hidden mb-8">
              {/* 1. Penambahan Gambar Header */}
        <div className="relative h-48 sm:h-64 w-full">
            <Image
                src={school.status === 'Negeri' ? '/sekolah-negeri.jpg' : '/sekolah-swasta.jpg'}
                alt={`Gambar ${school.name}`}
                layout="fill"
                objectFit="cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <CardContent className="p-8 -mt-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {school.name}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm mt-4 mb-4">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full shadow-md ${
                    school.status === 'Negeri' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {school.status}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-slate-700 bg-slate-200 font-medium">
                  {school.bentuk}
                </span>
                {/* 2. Informasi Average Rating & Total Review */}
              <div className="flex items-center pt-2 gap-2 ">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold text-lg">{avgRating.toFixed(1) ?? 'N/A'}</span>
                <span className="text-sm">({reviewCount} ulasan)</span>
              </div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                {school.description ||
                  "Discover excellence in elementary education at this prestigious institution in Bandung."}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:w-auto w-full">
              {isAdminOrSuperadmin && (
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 rounded-2xl px-6 py-3"
                    >
                      Edit School Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-hidden rounded-3xl">
                    <DialogHeader className="p-6 pb-6 border-b border-slate-200">
                      <DialogTitle className="text-3xl font-bold text-slate-900">
                        Edit School Details
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 text-lg">
                        Make changes to the school&apos;ss information here.
                        Click save when you&apos;sre done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
                      <EditSchoolForm
                        schoolData={{
                          ...school,
                          lat: school.lat ?? null,
                          lng: school.lng ?? null,
                          achievements: school.achievements ?? null,
                          contact: school.contact ?? null,
                          description: school.description ?? null,
                          programs: school.programs ?? null,
                          website: school.website ?? null,
                        }}
                        onFormSubmitted={() => setIsEditDialogOpen(false)}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button className="bg-slate-800 hover:bg-slate-900 text-white transition-all duration-300 transform hover:scale-105 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl">
                <span className="flex items-center">
                  <Link href="/dashboard/enroll">Enroll Now</Link>
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoCard title="General Information">
          <DetailItem label="Status" value={school.status} />
          <DetailItem label="NPSN" value={school.npsn} />
          <DetailItem label="Bentuk" value={school.bentuk} />
          <DetailItem label="Telephone" value={school.telp || "N/A"} />
          <DetailItem
            label="Website"
            value={
              school.website ? (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-slate-900 hover:underline transition-colors font-medium"
                >
                  {school.website}
                </a>
              ) : (
                "N/A"
              )
            }
          />
          <DetailItem label="Contact Person" value={school.contact || "N/A"} />
        </InfoCard>

        <InfoCard
          title="Location Details"
          className="md:col-span-1 lg:col-span-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <DetailItem label="Address" value={school.alamat} />
              <DetailItem label="Sub-District" value={school.kelurahan} />
              <DetailItem label="District" value={school.kecamatan} />
              {school.lat && school.lng && (
                <>
                  <DetailItem label="Latitude" value={school.lat.toFixed(6)} />
                  <DetailItem label="Longitude" value={school.lng.toFixed(6)} />
                </>
              )}
            </div>

            <div className="w-full h-64 lg:h-full min-h-[250px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              {school.lat && school.lng && !isEditDialogOpen ? (
                <DynamicSchoolMap
                  lat={school.lat}
                  lng={school.lng}
                  name={school.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm">
                      {isEditDialogOpen
                        ? "Map hidden while editing"
                        : "Map coordinates not available"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </InfoCard>

        <InfoCard title="About the School">
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-700 leading-relaxed">
              {school.description ||
                "No description provided for this school yet. Please check back later for more detailed information about their programs and facilities."}
            </p>
          </div>
        </InfoCard>

        <InfoCard title="Programs Offered" className="lg:col-span-2">
          <DetailItem
            label="Programs"
            value={
              school.programs && school.programs.split("\n").length > 0 ? (
                <ul className="space-y-3 mt-4">
                  {school.programs.split("\n").map((program, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700">{program}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "No programs listed."
              )
            }
          />
        </InfoCard>

        <InfoCard title="Achievements" className="lg:col-span-3">
          <DetailItem
            label="Achievements"
            value={
              school.achievements &&
              school.achievements.split("\n").length > 0 ? (
                <ul className="space-y-3 mt-4">
                  {school.achievements.split("\n").map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "No achievements listed."
              )
            }
          />
        </InfoCard>
      </div>
    </div>
  );
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col space-y-2 py-4 border-b last:border-b-0 border-slate-100">
    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-base text-slate-800 break-words leading-relaxed">
      {value}
    </span>
  </div>
);

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <Card
    className={`bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
  >
    <CardHeader className="p-6 pb-4 border-b border-slate-100">
      <CardTitle className="text-xl font-bold text-slate-900">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-4">{children}</CardContent>
  </Card>
);
