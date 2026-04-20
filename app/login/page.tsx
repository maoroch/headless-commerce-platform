'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/Authcontext';

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(form.email, form.password);
    setSubmitting(false);
    if (ok) router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row mt-20">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-16 pb-32"
        style={{ backgroundImage: "url('/img/auth/1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full mb-6">
            Organic &amp; Natural
          </span>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Welcome<br />back
          </h2>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            Sign in to access your orders, favourites and exclusive member offers.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 lg:py-0">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">Sign in</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-black underline underline-offset-2 hover:text-gray-600 transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-[#FFCAB3]/40 rounded-2xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="hello@example.com"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Password</label>
                <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-black transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 pr-12" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit — same pill CTA as Banner */}
            <button type="submit" disabled={submitting}
              className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 mt-2 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              <span className="text-sm font-bold tracking-wide">{submitting ? 'Signing in…' : 'Sign In'}</span>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                <ArrowRight size={18} className="text-white group-hover:text-black transition-colors duration-300 group-hover:translate-x-0.5" />
              </div>
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  );
}

