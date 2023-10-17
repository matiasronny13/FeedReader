import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { SupabaseClient } from "@supabase/supabase-js";

export function downloadRssItems(client: SupabaseClient, rssId: number) {
  return client.functions.invoke("edge_rss", {
    body: JSON.stringify({ ids: [rssId] })
  })
}

export default function useRssItemsDownload(rssId: number) {
  const client = useSupabase();
  const key = ['useRssItemsDownload', rssId];

  return useQuery(key, async () => {
    return downloadRssItems(client, rssId)
  }, 
  {
    // staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: false // disable this query from automatically running
  });
}