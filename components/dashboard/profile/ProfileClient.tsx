// File: components/dashboard/ProfileClient.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Shield, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Badge } from "@/components/ui/badge";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
};

interface ProfileClientProps {
  user: UserProfile;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0][0];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Left Column: Profile Card */}
      <div className="w-full lg:w-1/3 h-full">
        <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* <CardContent className="p-8 text-center"> */}
          <CardContent className="flex-1 p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Profile"}
                  width={128}
                  height={128}
                  className="rounded-full object-cover w-full h-full ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-slate-200 text-slate-700 font-bold text-4xl ring-4 ring-white shadow-lg">
                  {getInitials(user.name)}
                </div>
              )}
              {/* Profile Picture Upload Overlay (UI Only) */}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white w-8 h-8" />
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Change profile picture (coming soon)"
                  disabled
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-600">{user.email}</p>
            <Badge className="mt-4 bg-slate-200 text-slate-800 hover:bg-slate-300 mb-38">
              {user.role}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Settings Card */}
      <div className="w-full lg:w-2/3 h-full">
        {/* <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-xl overflow-hidden"> */}
        <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <CardHeader className="p-0">
            <div className="flex">
              <button
                onClick={() => setActiveTab("general")}
                className={`border-b border-slate-200/70 flex-1 p-6 text-center font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "general"
                    ? "text-slate-800 bg-white/50 border-b-2 border-slate-800"
                    : "text-slate-500 hover:bg-slate-50/50"
                }`}
              >
                <User size={18} /> General
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`border-b border-slate-200/70 flex-1 p-6 text-center font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "security"
                    ? "text-slate-800 bg-white/50 border-b-2 border-slate-800"
                    : "text-slate-500 hover:bg-slate-50/50"
                }`}
              >
                <Shield size={18} /> Security
              </button>
            </div>
          </CardHeader>
          {/* <CardContent className="p-8"> */}
          <CardContent className="flex-1 p-8">
            {activeTab === "general" && (
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                  Account Information
                </CardTitle>
                <CardDescription className="text-slate-600 mb-8">
                  Update your personal details here.
                </CardDescription>
                <UpdateProfileForm user={user} />
              </div>
            )}
            {activeTab === "security" && (
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                  Change Password
                </CardTitle>
                <CardDescription className="text-slate-600 mb-8">
                  For security, please choose a strong password.
                </CardDescription>
                <ChangePasswordForm />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}