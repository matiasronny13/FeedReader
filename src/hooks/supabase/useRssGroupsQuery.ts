import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useRssGroupsQuery = () => {
    const client = useSupabase();
    const key = ['RssGroupsQuery'];
   
    return useQuery(key, async () => {
      return await client?.from("rss_group")
                   .select("id, name")
                   .throwOnError()
                   .then((result) => { 
                    return result.data ? result.data : []
                  });
    }, 
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      //enabled: false // disable this query from automatically running
    });
}

export default useRssGroupsQuery