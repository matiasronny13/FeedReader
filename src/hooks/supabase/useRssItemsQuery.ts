import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getRssItems(client: SupabaseClient|null, rssId: number) {
  return await client?.from("vw_rss_items_json")
    .select('id, title, link, pub_date, description, has_read')
    .eq("rss_id", rssId)
    .order("pub_date", { ascending: false })
    .range(0, 100)
    .throwOnError()
    .then((result) => result.data);
}

export default function useRssItemsQuery(rssId: number) {
  const client = useSupabase();
  const key = ['RssItemsQuery', rssId];

  return useQuery(key, async () => {
    return await getRssItems(client, rssId)
  }, 
  {
    // staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnWindowFocus: false,
    //enabled: false // disable this query from automatically running
  });
}