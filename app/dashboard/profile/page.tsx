// import UnderConstruction from "@/components/under-construction";

// export default function DashboardStatsPage() {
//   return (
//     <UnderConstruction />
//   );
// }

// File: app/dashboard/profile/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/dashboard/profile/ProfileClient";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <User className="w-7 h-7 text-slate-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Profile Settings
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Manage your account details and security settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <ProfileClient user={session.user} />
        </div>
      </div>
    </div>
  );
}