// File: app/dashboard/detail/[id]/page.tsx

import React from "react";
import SchoolDetail from "@/components/dashboard/SchoolDetail";
import ReviewList from "@/components/dashboard/ReviewList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Fixed parameter type
}) {
  const resolvedParams = await params; // Await the params Promise
  const schoolId = parseInt(resolvedParams.id, 10);
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Back Button Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <Button variant="outline" asChild className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-300 transition-all duration-200 rounded-xl">
              <Link href="/dashboard">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* School Details Section */}
          <SchoolDetail schoolId={schoolId} />

          {/* Reviews Section */}
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl overflow-hidden mt-6">
            <CardHeader className="p-8 pb-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    What do people review about this school?
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg mt-2">
                    Real experiences from our school community
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ReviewList schoolId={schoolId} />

              {/* Sign in prompt for non-authenticated users */}
              {!session?.user && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      Share Your Experience
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                      Help other parents and students by sharing your honest review of this school. Your insights make a difference in our community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild className="bg-slate-800 hover:bg-slate-900 text-white rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Link href="/auth/signin">Sign In to Review</Link>
                      </Button>
                      <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 rounded-2xl px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                        <Link href="/auth/signup">Create Account</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}