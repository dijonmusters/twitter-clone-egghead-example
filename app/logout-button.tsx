"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return session ? (
    <button className="text-xs text-gray-400" onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <span className="text-xs text-gray-400">You need to sign in</span>
  );
}
