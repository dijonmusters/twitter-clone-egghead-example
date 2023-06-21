import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import RealtimeTweets from "./realtime-tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase.from("tweets").select("*, likes(user_id)");

  const tweets = data?.map(({ likes, ...tweet }) => ({
    ...tweet,
    likes: likes.length,
    user_has_liked_tweet: !!likes.find((like) => like.user_id === user?.id),
  }));

  const addTweet = async (formData: FormData) => {
    "use server";

    const title = String(formData.get("title"));
    const supabase = createServerActionClient({ cookies });
    await supabase.from("tweets").insert({ title });
    revalidatePath("/");
  };

  return (
    <>
      <form className="border border-gray-800 flex flex-col" action={addTweet}>
        <input
          className="bg-inherit text-2xl placeholder-gray-500 py-8 px-4 inline-block leading-loose"
          name="title"
          placeholder="What is happening?!"
        />
        <hr className="border-gray-800" />
        <button className="bg-blue-500 rounded-3xl m-4 py-2 px-4 w-fit self-end">
          Tweet
        </button>
      </form>
      <RealtimeTweets userId={user.id} tweets={tweets ?? []} />
    </>
  );
}
