"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, List, BarChart2, User, Users, LogOut  } from "lucide-react";
import Image from "next/image"; // Import Image for optimized images
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { label: "Map", href: "/dashboard/map", icon: MapPin },
  { label: "Schools", href: "/dashboard/list", icon: List },
  { label: "Stats", href: "/dashboard/stats", icon: BarChart2 },
];

const adminNavItems = [
    { label: "User Management", href: "/dashboard/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter()
  const { data: session, status } = useSession();

  const allNavItems = [...navItems];
  if (session?.user?.role === 'SUPERADMIN') {
    allNavItems.push(...adminNavItems);
  }

  return (
    <nav className="w-60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 backdrop-blur-md border-r border-slate-200/50 shadow-lg flex flex-col h-screen">
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
      <div className="flex flex-col h-full justify-between">
      <div className="p-4 flex flex-col space-y-4 gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Navigation
          </p>
          <ul className="space-y-2">
            {/* CORRECTED: map over the dynamically generated nav items */}
            {allNavItems.map(({ label, href, icon: Icon }) => {
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

        </div>


        {/* Quick Stats Card
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
        </div> */}

        {/* Help Section and signout */}
        <div>
        <div className=" bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 m-4 text-white shadow-xl">
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

      <div className="p-4 border-t border-slate-200/50">
          {status === 'loading' ? (
              <div className="flex items-center p-2">
                  <Skeleton className="h-10 w-10 rounded-xl mr-3" />
                  <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                  </div>
              </div>
          ) : session?.user ? (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <button className="w-full flex items-center p-2 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300 cursor-pointer text-left">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center mr-3 shadow-md shrink-0">
                              {session.user.image ? (<Image src={session.user.image} alt="User" width={40} height={40} className="rounded-xl" />) : (<User className="w-5 h-5 text-white" />)}
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                          </div>
                      </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2 text-xs text-muted-foreground">Signed in as <span className="font-semibold text-foreground">{session.user.role}</span></div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <Link href="/auth/sign-in" className="w-full text-center p-3 rounded-2xl bg-white/60 hover:bg-white/80 transition-all">
                Sign In
            </Link>
          )}
          </div>
          </div>


      </div>
    </nav>
  );
}