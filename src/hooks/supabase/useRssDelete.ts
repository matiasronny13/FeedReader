import { useMutation, useQueryClient  } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

function useRssDelete() {
    const client = useSupabase()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id:number) => {
            await client.from("rss_items").delete().eq('rss_id', id)
            await client.from("rss").delete().eq('id', id)
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['RssByGroupQuery'] });
            queryClient.invalidateQueries({ queryKey: ['RssQuery'] });
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export default useRssDelete;