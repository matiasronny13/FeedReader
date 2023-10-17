import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useRssByGroupQuery = (group_id: string) => {
    const client = useSupabase();
    const key = ['RssByGroupQuery', group_id];

    return useQuery(key, async () => {
        return client.from("rss").select("*").eq("group_id", group_id).order("title")
            .throwOnError()
            .then((result) => result.data);
        }, 
        {
            // staleTime: Infinity,
            // cacheTime: Infinity,
            refetchOnWindowFocus: false,
            //enabled: false // disable this query from automatically running
        }
    );
}

export default useRssByGroupQuery;