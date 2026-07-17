"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield, Mail, Lock } from "lucide-react";

export default function ParentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: replace with Supabase auth
    // Stub: any non-empty email/password logs in for demo
    await new Promise((r) => setTimeout(r, 600));
    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }
    // Store stub session in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sws_parent_session", JSON.stringify({ email, loggedInAt: Date.now() }));
    }
    router.push("/parent-portal");
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden md:flex flex-col justify-between w-[40%] shrink-0 relative overflow-hidden"
        style={{ background: "#1B3A5C" }}
      >
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #B8D4CE 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-10 text-center">
          <Link href="/" className="mb-6">
            <Image
              src="/logo.svg"
              alt="Saltwater Sprouts"
              width={96}
              height={96}
              className="brightness-0 invert mx-auto"
            />
          </Link>
          <p className="text-white text-2xl font-extrabold tracking-tight leading-tight">
            Saltwater Sprouts
          </p>
          <p className="text-[#B8D4CE]/70 text-sm mt-1 font-medium">
            Early Learning Center
          </p>

          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              { icon: "📸", text: "Your child's daily photos" },
              { icon: "💳", text: "View & pay invoices online" },
              { icon: "📄", text: "Access important documents" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{icon}</span>
                <span className="text-white/70 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative wave bottom */}
        <div className="relative z-10 w-full">
          <svg
            viewBox="0 0 400 80"
            className="w-full"
            style={{ fill: "rgba(184,212,206,0.1)" }}
            preserveAspectRatio="none"
          >
            <path d="M0,40 C80,80 160,0 240,40 C320,80 400,20 400,40 L400,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12" style={{ background: "#F8F5F0" }}>
        {/* Mobile logo */}
        <div className="md:hidden mb-8 text-center">
          <Link href="/">
            <Image src="/logo.svg" alt="Saltwater Sprouts" width={64} height={64} className="mx-auto mb-3" />
          </Link>
          <p className="font-extrabold text-navy text-lg">Saltwater Sprouts</p>
          <p className="text-navy/50 text-xs">Early Learning Center</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-navy">Welcome back</h1>
            <p className="text-navy/55 text-sm mt-1.5">
              Sign in to your parent portal
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(27,58,92,0.08)] border border-seafoam/20 p-8 space-y-5"
          >
            {error && (
              <div className="rounded-xl bg-coral/10 border border-coral/30 px-4 py-3 flex items-start gap-2">
                <span className="text-coral text-sm mt-0.5">⚠</span>
                <p className="text-coral text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full border-2 border-seafoam/40 rounded-xl pl-10 pr-4 py-3 text-navy placeholder-navy/30 focus:outline-none focus:border-sage transition-colors text-sm bg-white"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-seafoam/40 rounded-xl pl-10 pr-11 py-3 text-navy placeholder-navy/30 focus:outline-none focus:border-sage transition-colors text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <a href="#" className="text-xs text-sage hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white font-bold py-3.5 rounded-full hover:bg-coral/85 active:scale-[0.98] transition-all disabled:opacity-60 text-sm flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(232,137,106,0.35)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Enrollment link */}
            <p className="text-center text-xs text-navy/50 pt-1">
              Not enrolled yet?{" "}
              <Link href="/enrollment" className="text-coral font-bold hover:underline">
                Start enrollment
              </Link>
            </p>
          </form>

          {/* Trust line */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-navy/40">
            <Shield className="w-3.5 h-3.5" />
            <p className="text-xs">Secured with SSL encryption</p>
          </div>

          <p className="text-center text-xs text-navy/40 mt-3">
            Need help?{" "}
            <Link href="/contact" className="text-sage hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
