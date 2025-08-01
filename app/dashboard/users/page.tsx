// File: app/dashboard/users/page.tsx
// CORRECTED: New page for user management

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserManagementClient from "@/components/dashboard/UserManagementClient";
import { useAppDispatch } from "@/redux/store";
import { fetchUsersAsync } from "@/redux/userSlice";
import { useSchools } from "@/lib/queries";
// import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Fetch schools for the "assign school" dropdown in the forms
  const { data: schools, isLoading: schoolsLoading, error: schoolsError } = useSchools();

  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session to be loaded
    }

    if (status === "unauthenticated" || session?.user?.role !== 'SUPERADMIN') {
      router.replace("/dashboard/map"); // Redirect if not authorized
      return;
    }
    
    // Fetch user data if authorized
    if (session?.user?.role === 'SUPERADMIN') {
        dispatch(fetchUsersAsync());
    }

  }, [session, status, router, dispatch]);

  // Loading state for the page
  if (status === "loading" || schoolsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">Loading user management...</p>
        </div>
      </div>
    );
  }
  
  if (schoolsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-slate-700 font-medium">Error: Could not load school data</p>
          <p className="text-slate-500 mt-2">User management is unavailable</p>
        </div>
      </div>
    );
  }

  // Render the page only if authorized
  if (session?.user?.role === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
        {/* Header Section
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                User 
                <span className="text-slate-700"> Management</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl">
                Manage user accounts, assign roles, and oversee system access. Create and edit user profiles with proper permissions and school assignments.
              </p>
              <div className="flex items-center mt-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-200 text-slate-700">
                  👥 System Administration
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Content Section */}
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <UserManagementClient schools={schools || []} />
          </div>
        </div>
      </div>
    );
  }

  // Fallback, although the useEffect should handle redirection
  return null; 
}