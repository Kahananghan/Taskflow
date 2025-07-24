"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Task Management System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A full-stack Next.js application with authentication, database integration, and modern UI
          </p>

          {!session ? (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <Link
                    href="/signin"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 block text-center"
                  >
                    Sign In with Email
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  Demo credentials: test@example.com / password
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="text-center">
                <div className="mb-4">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                  )}
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Welcome back!
                  </h2>
                  <p className="text-gray-600 mt-2">{session.user?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 block text-center"
                  >
                    Go to Dashboard
                  </Link>
                  
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">🔐 Authentication</h3>
            <p className="text-gray-600">
              Secure authentication with NextAuth.js supporting Google OAuth and credentials
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">🗄️ Database</h3>
            <p className="text-gray-600">
              Prisma ORM with PostgreSQL for robust data management and type safety
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">⚡ Full-Stack</h3>
            <p className="text-gray-600">
              Complete CRUD operations with API routes and modern React components
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}