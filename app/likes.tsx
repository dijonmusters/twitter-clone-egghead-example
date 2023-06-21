"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { experimental_useOptimistic as useOptimistic } from "react";

export default function Likes({
  userId,
  tweet,
}: {
  userId?: string;
  tweet: Tweet;
}) {
  const router = useRouter();
  const [optimisticTweet, addOptimisticTweet] = useOptimistic(
    null as null | Tweet,
    (_, newTweet) => newTweet as Tweet
  );

  const toggleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userId && !optimisticTweet) {
      const supabase = createClientComponentClient();

      if (tweet.user_has_liked_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: userId, tweet_id: tweet.id });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .insert({ user_id: userId, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  const fastTweet = optimisticTweet ?? tweet;

  return (
    <button
      className={`flex items-center w-fit hover:text-red-600 [&>svg]:hover:fill-red-600 [&>svg]:hover:stroke-red-600 ${
        fastTweet.user_has_liked_tweet
          ? "text-red-600 [&>svg]:fill-red-600 [&>svg]:stroke-red-600"
          : "text-gray-500 [&>svg]:fill-none [&>svg]:stroke-gray-500"
      }`}
      onClick={toggleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span className="ml-1">{fastTweet.likes}</span>
    </button>
  );
}
