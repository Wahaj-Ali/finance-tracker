"use client";

import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-3 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-accent-dim"
    >
      <LogIn className="h-5 w-5" />
      Continue with Google
    </button>
  );
}
