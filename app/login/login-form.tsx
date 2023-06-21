"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { Session } from "@supabase/auth-helpers-nextjs";

export default function LoginForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return <button onClick={handleSignIn}>Sign in</button>;
}
