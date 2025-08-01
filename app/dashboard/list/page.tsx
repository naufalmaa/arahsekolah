// app/dashboard/list/page.tsx
'use client';

import { useSchools } from '@/lib/queries';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ListPage() {
  const { data: schools, isLoading, error } = useSchools();

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-slate-600 font-medium">Loading schools...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg text-slate-700 font-medium">Error loading schools</p>
        <p className="text-slate-500 mt-2">Please try again later</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">

      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Bandung&apos;s Best 
              <span className="text-slate-700"> Elementary Schools</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Discover and compare elementary schools in Bandung. Find detailed information, authentic reviews, and make informed decisions for your child&apos;s education.
            </p>
            <div className="flex items-center mt-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-200 text-slate-700">
                Total School: 📚 {schools?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {schools!.map(s => (
              <Card 
                key={s.id} 
                className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white overflow-hidden"
                asChild
              >
                <Link href={`/dashboard/detail/${s.id}`}>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300 leading-tight">
                      {s.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {s.kelurahan}, {s.kecamatan}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-slate-600 font-medium">N/A</span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        View Details →
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State (if no schools) */}
      {schools && schools.length === 0 && (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-200 max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Schools Found</h3>
            <p className="text-slate-600 leading-relaxed">
              We couldn&apos;t find any schools at the moment. Please check back later or contact support if this issue persists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}