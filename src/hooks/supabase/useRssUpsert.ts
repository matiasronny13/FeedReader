import { useMutation, useQueryClient  } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Rss } from "../../shared/types/Rss";

function useRssUpsert() {
    const client = useSupabase()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data:Rss) => {
            return await client?.from("rss")            
                        .upsert(data)
                        .select()
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

export default useRssUpsert;