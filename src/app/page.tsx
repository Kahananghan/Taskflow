"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session && mounted) {
      router.push('/dashboard');
    }
  }, [session, mounted, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            TaskFlow Pro
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of productivity with our AI-powered task management platform
          </p>

          {!session ? (
            <div className="space-y-8 animate-fadeInScale">
              <div className="glass p-8 rounded-2xl shadow-2xl max-w-md mx-auto hover-lift">
                <h2 className="text-2xl font-semibold mb-6 text-white">Get Started</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center px-6 py-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-gray-700 hover:bg-white hover:scale-105 transition-all duration-300 font-medium"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-transparent text-white/70">Or</span>
                    </div>
                  </div>

                  <Link
                    href="/signin"
                    className="w-full btn-gradient text-white py-4 px-6 rounded-xl font-medium block text-center shadow-lg"
                  >
                    Sign In with Email
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl shadow-2xl max-w-md mx-auto hover-lift animate-fadeInScale">
              <div className="text-center">
                <div className="mb-6">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/30 shadow-lg"
                    />
                  )}
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Welcome back! 👋
                  </h2>
                  <p className="text-white/80">{session.user?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="w-full btn-gradient text-white py-4 px-6 rounded-xl font-medium block text-center shadow-lg"
                  >
                    🚀 Go to Dashboard
                  </Link>
                  
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass p-8 rounded-2xl shadow-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl mb-4 animate-bounce">🔐</div>
            <h3 className="text-xl font-semibold mb-4 text-white">Secure Authentication</h3>
            <p className="text-white/80 leading-relaxed">
              Enterprise-grade security with NextAuth.js, Google OAuth, and encrypted sessions
            </p>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.5s'}}>🗄️</div>
            <h3 className="text-xl font-semibold mb-4 text-white">Smart Database</h3>
            <p className="text-white/80 leading-relaxed">
              Type-safe Prisma ORM with PostgreSQL for lightning-fast data operations
            </p>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl hover-lift animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '1s'}}>⚡</div>
            <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered</h3>
            <p className="text-white/80 leading-relaxed">
              Intelligent task management with real-time updates and modern React architecture
            </p>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slideInRight">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <div className="text-white/70">Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50ms</div>
            <div className="text-white/70">Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/70">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}