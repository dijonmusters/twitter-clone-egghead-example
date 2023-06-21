import type { Database as DB } from "@/lib/database.types";

type SupaTweet = DB["public"]["Tables"]["tweets"]["Row"];

declare global {
  type Database = DB;
  type Tweet = Omit<SupaTweet, "likes"> & {
    likes: number;
    user_has_liked_tweet: boolean;
  };
}
