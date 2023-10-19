import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function downloadRssItems(client: SupabaseClient|null, rssId: number) {
  return await client?.functions.invoke("edge_rss", {
    body: JSON.stringify({ ids: [rssId] })
  })
}

export default function useRssItemsDownload(rssId: number) {
  const client = useSupabase();
  const key = ['useRssItemsDownload', rssId];

  return useQuery(key, async () => {
    return await downloadRssItems(client, rssId)
  }, 
  {
    // staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: false // disable this query from automatically running
  });
}