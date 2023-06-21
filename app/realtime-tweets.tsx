"use client";

import Link from "next/link";
import Likes from "./likes";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function RealtimeTweets({
  userId,
  tweets,
}: {
  userId: string;
  tweets: Tweet[];
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return tweets?.map((tweet) => (
    <Link
      key={tweet.id}
      className="flex flex-col border border-gray-800 px-4 py-2 hover:bg-gray-800"
      href={`/${tweet.id}`}
    >
      {tweet.title} <Likes userId={userId} tweet={tweet} />
    </Link>
  ));
}
