"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, List, BarChart2, User } from "lucide-react";
import Image from "next/image"; // Import Image for optimized images
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Map", href: "/dashboard/map", icon: MapPin },
  { label: "List", href: "/dashboard/list", icon: List },
  { label: "Stats", href: "/dashboard/stats", icon: BarChart2 },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 backdrop-blur-md border-r border-slate-200/50 shadow-lg">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <Image
              src="/logo_only_white.png"
              alt="ArahSekolah Logo"
              width={24}
              height={24}
              className="rounded-xl shadow-sm"
              priority
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">ArahSekolah</h2>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Navigation
          </p>
          <ul className="space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-center p-3 rounded-2xl transition-all duration-300 font-medium text-sm",
                      isActive 
                        ? "bg-slate-800 text-white shadow-lg transform scale-105" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:shadow-md hover:scale-102"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-300",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-slate-100 group-hover:bg-slate-200 group-hover:scale-110"
                    )}>
                      <Icon 
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? "text-white" : "text-slate-600 group-hover:text-slate-800"
                        )} 
                        size={18} 
                      />
                    </div>
                    <span className="font-medium">{label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200 shadow-lg">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-800">Quick Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Schools</span>
              <span className="text-sm font-bold text-slate-800">50+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Reviews</span>
              <span className="text-sm font-bold text-slate-800">1,200+</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
              <div className="bg-slate-800 h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Database completion: 75%</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 text-white shadow-xl">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Need Help?</span>
          </div>
          <p className="text-xs text-white/80 mb-3 leading-relaxed">
            Explore our comprehensive school database and find the perfect fit for your child.
          </p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-xl transition-all duration-300 hover:scale-105">
            Contact Support
          </button>
        </div>

        {/* User Profile Section */}
        <div className="mt-6 pt-4 border-t border-slate-200/50">
          <div className="flex items-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Parent User</p>
              <p className="text-xs text-slate-500 truncate">Free Account</p>
            </div>
            <div className="ml-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}