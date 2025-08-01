// file: app/(public)/page.tsx

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Header/Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <div className="relative">
            <Image
              src="/logo_only.png"
              alt="ArahSekolah Logo"
              width={35}
              height={35}
              className="mr-3 rounded-xl shadow-sm"
              priority
            />
          </div>
          <span className="text-3xl font-bold text-slate-800">
            ArahSekolah
          </span>
        </div>
        <nav className="flex items-center space-x-3">
          <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 mr-3">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6">
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-16 lg:py-24">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start mb-12 lg:mb-0 lg:pr-12">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-200 text-slate-700 mb-6">
              🎓 Trusted by 1000+ Parents in Bandung
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 text-center lg:text-left">
            Find Bandung&apos;s
            <span className="block text-slate-700">
              Best Elementary Schools
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed text-center lg:text-left">
            Discover, compare, and connect with top-rated elementary schools in Bandung. 
            Make informed decisions with authentic parent reviews and streamlined enrollment processes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild className="bg-slate-800 hover:bg-slate-900 text-white text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/dashboard/map">
                <span className="flex items-center">
                  Explore Schools
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 text-lg px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </div>
          
          <div className="flex items-center mt-8 text-sm text-slate-500">
            <div className="flex -space-x-2 mr-3">
              <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-white"></div>
            </div>
            <span>Join parents who found their perfect school</span>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center relative">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-400 rounded-3xl blur-3xl opacity-20 transform rotate-6"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/pupils-reading-book-classroom-lower.png"
                alt="Students learning in a modern classroom"
                width={600}
                height={400}
                className="rounded-2xl w-full h-auto"
                priority
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 ml-3">400+ Schools</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 ml-3">Verified Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Why Parents Choose 
              <span className="text-slate-700"> ArahSekolah</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              We make finding the perfect elementary school simple, transparent, and stress-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group text-center p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-slate-50">
              <CardHeader className="flex justify-center items-center mb-6">
                <div className="w-150 h-75 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/database.jpg" alt="Comprehensive School Database" width={1000} height={40} />
                </div>
              </CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-slate-900">Comprehensive Database</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                Access detailed profiles of 400+ elementary schools in Bandung with complete information about facilities, programs, and admission requirements.
              </CardDescription>
            </Card>
            
            <Card className="group text-center p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-slate-50">
              <CardHeader className="flex justify-center items-center mb-6">
                <div className="w-150 h-75 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/review.jpg" alt="Authentic Parent Reviews" width={1000} height={40} />
                </div>
              </CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-slate-900">Verified Reviews</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                Read authentic reviews from real parents who have enrolled their children. Get insights into teaching quality, facilities, and school culture.
              </CardDescription>
            </Card>
            
            <Card className="group text-center p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-slate-50">
              <CardHeader className="flex justify-center items-center mb-6">
                <div className="w-150 h-75 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/enrollment.jpg" alt="Streamlined School Registration" width={1000} height={40} />
                </div>
              </CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-slate-900">Easy Enrollment</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                Connect directly with schools and streamline your application process. Get assistance with documentation and enrollment procedures.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 lg:px-12 bg-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Find Your Child&apos;s Perfect School?
          </h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Join thousands of parents in Bandung who trust ArahSekolah to make the best educational decisions for their children&apos;s future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-slate-800 hover:bg-slate-100 text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold">
              <Link href="/auth/sign-up">
                <span className="flex items-center">
                  Start Free Today
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </Button>
            <Button asChild className="bg-white text-slate-800 hover:bg-slate-100 text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold">
              <Link href="/dashboard/map">Browse Schools</Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            <span>✨ No credit card required • Free to explore • Trusted by parents</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 p-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/logo_only_white.png"
                alt="ArahSekolah Logo"
                width={30}
                height={30}
                className="mr-3 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">ArahSekolah</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm mb-2">
                &copy; {new Date().getFullYear()} ArahSekolah. All rights reserved.
              </p>
              <div className="space-x-6 text-sm">
                <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}