import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

function useRssItemsUpdateStatus() {
    const client = useSupabase()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (rss_id:number) => {
            return await client?.from("rss_items")
            .update({ has_read: true })
            .eq('rss_id', rss_id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['RssQuery'] });
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export default useRssItemsUpdateStatus;