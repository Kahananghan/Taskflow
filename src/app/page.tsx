"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();

  const features = [
    { icon: "🚀", title: "Boost Productivity", desc: "Get 3x more done with smart task prioritization" },
    { icon: "🎯", title: "Smart Goals", desc: "AI-powered goal tracking and achievement insights" },
    { icon: "📊", title: "Analytics", desc: "Detailed reports on your productivity patterns" },
    { icon: "🔔", title: "Smart Reminders", desc: "Never miss a deadline with intelligent notifications" }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
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
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">TaskFlow Pro</div>
          <div className="hidden md:flex space-x-8 text-white/80">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center animate-fadeInUp mb-20">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              ✨ The Future of Task Management is Here
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text leading-tight">
            TaskFlow Pro
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
            Transform your productivity with AI-powered task management
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who've revolutionized their workflow with our intelligent platform
          </p>

          {/* Dynamic Feature Showcase */}
          <div className="glass p-6 rounded-2xl max-w-md mx-auto mb-12 animate-fadeInScale">
            <div className="text-4xl mb-3">{features[currentFeature].icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{features[currentFeature].title}</h3>
            <p className="text-white/70">{features[currentFeature].desc}</p>
          </div>

          {!session ? (
            <div className="space-y-8 animate-fadeInScale">
              <div className="glass p-10 rounded-3xl shadow-2xl max-w-lg mx-auto hover-lift">
                <h2 className="text-3xl font-semibold mb-8 text-white">Start Your Journey</h2>
                <div className="space-y-6">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center px-8 py-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl text-gray-700 hover:bg-white hover:scale-105 transition-all duration-300 font-semibold text-lg"
                  >
                    <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-white/70 font-medium">Or sign in with email</span>
                    </div>
                  </div>

                  <Link
                    href="/signin"
                    className="w-full btn-gradient text-white py-5 px-8 rounded-2xl font-semibold text-lg block text-center shadow-xl hover-lift"
                  >
                    Get Started Free
                  </Link>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-white/60 text-sm">
                    ✅ Free forever • ✅ No credit card required • ✅ 2-minute setup
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-10 rounded-3xl shadow-2xl max-w-lg mx-auto hover-lift animate-fadeInScale">
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/30 shadow-xl">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-semibold text-white mb-3">
                    Welcome back! 👋
                  </h2>
                  <p className="text-white/80 text-lg">{session.user?.name || session.user?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="w-full btn-gradient text-white py-5 px-8 rounded-2xl font-semibold text-lg block text-center shadow-xl hover-lift"
                  >
                    🚀 Open Dashboard
                  </Link>
                  
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-8 rounded-2xl hover:bg-white/30 transition-all duration-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Features Grid */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <div className="glass p-10 rounded-3xl shadow-2xl hover-lift animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="text-5xl mb-6 animate-bounce">🔐</div>
            <h3 className="text-2xl font-bold mb-6 text-white">Enterprise Security</h3>
            <p className="text-white/80 leading-relaxed text-lg">
              Bank-level encryption, OAuth 2.0, and GDPR compliance ensure your data stays protected
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">OAuth 2.0</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">GDPR</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">SSL</span>
            </div>
          </div>
          
          <div className="glass p-10 rounded-3xl shadow-2xl hover-lift animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="text-5xl mb-6 animate-bounce" style={{animationDelay: '0.5s'}}>🧠</div>
            <h3 className="text-2xl font-bold mb-6 text-white">AI-Powered Insights</h3>
            <p className="text-white/80 leading-relaxed text-lg">
              Machine learning algorithms analyze your patterns to optimize productivity and suggest improvements
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">Smart Suggestions</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">Pattern Analysis</span>
            </div>
          </div>
          
          <div className="glass p-10 rounded-3xl shadow-2xl hover-lift animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="text-5xl mb-6 animate-bounce" style={{animationDelay: '1s'}}>⚡</div>
            <h3 className="text-2xl font-bold mb-6 text-white">Lightning Fast</h3>
            <p className="text-white/80 leading-relaxed text-lg">
              Built with Next.js 15 and optimized for speed. Real-time updates and instant synchronization
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">Real-time</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">Next.js 15</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">TypeScript</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="mt-32 glass p-12 rounded-3xl max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Trusted by Professionals Worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-3">99.9%</div>
              <div className="text-white/70 text-lg">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-3">50K+</div>
              <div className="text-white/70 text-lg">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-3">1M+</div>
              <div className="text-white/70 text-lg">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-3">24/7</div>
              <div className="text-white/70 text-lg">Expert Support</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Product Manager", text: "TaskFlow Pro transformed how our team collaborates. Productivity increased by 40%!" },
              { name: "Mike Rodriguez", role: "Freelancer", text: "The AI insights helped me identify my peak productivity hours. Game changer!" },
              { name: "Emily Watson", role: "Startup Founder", text: "Clean interface, powerful features. Exactly what we needed to scale efficiently." }
            ].map((testimonial, index) => (
              <div key={index} className="glass p-8 rounded-2xl hover-lift animate-fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-white/90 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="glass p-12 rounded-3xl max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Productivity?</h2>
            <p className="text-xl text-white/80 mb-10">Join thousands of professionals who've already made the switch</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="btn-gradient text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl hover-lift"
              >
                Start Free Trial
              </Link>
              <button className="bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl hover:bg-white/30 transition-all duration-300 font-semibold">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}