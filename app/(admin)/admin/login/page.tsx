"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/curated-experiences.png"
            alt="Curated Experiences"
            className="h-12 w-auto mx-auto"
          />
          <p className="text-xs tracking-widest uppercase text-warm-500 mt-3">
            Admin Dashboard
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-warm-200 text-center">
            <p className="text-sm text-foreground/80">
              Check your email for a magic link to sign in.
            </p>
            <p className="mt-2 text-xs text-foreground-muted">
              Sent to {email}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl p-8 shadow-sm border border-warm-200"
          >
            <label className="block text-xs tracking-wide text-foreground-muted mb-2">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@curatedexperiences.com"
              className="w-full px-4 py-3 text-sm border border-warm-200 rounded-lg
                focus:outline-none focus:border-navy/30 bg-warm-50"
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 text-sm font-medium bg-navy text-white
                rounded-lg hover:bg-navy-light transition-colors"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
