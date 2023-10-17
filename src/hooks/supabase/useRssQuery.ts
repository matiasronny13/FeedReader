import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

function useRssQuery() {
    const client = useSupabase();
    const key = ['RssQuery'];
   
    return useQuery(key, async () => {
      return client.from("vw_rss_json")
                   .select("*")
                   .throwOnError()
                   .then((result) => { 
                    return result.data ? result.data[0] : []
                  });
    }, 
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      //enabled: false // disable this query from automatically running
    });
  }
   
  export default useRssQuery;