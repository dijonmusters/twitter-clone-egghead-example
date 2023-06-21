import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Likes from "../likes";

export default async function Tweet({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("tweets")
    .select("*, likes(user_id)")
    .match({ id })
    .single();

  if (!data) {
    notFound();
  }

  const tweet = {
    ...data,
    likes: data.likes.length,
    user_has_liked_tweet: !!data.likes.find(
      (like) => like.user_id === user?.id
    ),
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col border border-gray-800 px-4 py-2">
        {tweet.title} <Likes userId={user?.id} tweet={tweet} />
      </div>
    </div>
  );
}
