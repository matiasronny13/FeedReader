import { useMutation } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

function useRssItemsUpdateStatus() {
    const client = useSupabase()
    return useMutation({
        mutationFn: async (rss_id:number) => {
            return client.from("rss_items")
            .update({ has_read: true })
            .eq('rss_id', rss_id)
        }
    })
}

export default useRssItemsUpdateStatus;