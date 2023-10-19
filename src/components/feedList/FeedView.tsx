import useRssItemsQuery from "../../hooks/supabase/useRssItemsQuery";
import { useEffect, useRef, useState } from "react";
import FeedList from "../../components/feedList/FeedList";
import useRssItemsDownload from "../../hooks/supabase/useRssItemDownload";
import { Box } from "@mui/material";
import FeedBlog from "../../components/feedList/FeedBlog";
import { FeedItem } from "../../shared/types/FeedItem";
import FeedMenu, { MENU_ITEMS } from "../../components/feedList/FeedMenu";
import useRssItemsUpdateStatus from "../../hooks/supabase/useRssItemsUpdateStatus";

type Props = {
    rssId: number
}

const FeedView = ({rssId}: Props) => {
  const viewModeRef = useRef<MENU_ITEMS>()
  const [viewMode, setViewMode] = useState<MENU_ITEMS>(MENU_ITEMS.GRID_MODE)
  const rssItemQueryResult = useRssItemsQuery(rssId);
  const rssItemDownloadResult = useRssItemsDownload(rssId);
  const rssItemsUpdateStatusResult = useRssItemsUpdateStatus()

  const MAX_RETRY = 6
  const fetchRetry = useRef<number>(MAX_RETRY);
  const timeoutId = useRef<NodeJS.Timeout|null>(null)
  const clearTimeoutValidated = () => {
    if(timeoutId.current)
    {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }

  useEffect(() => {
    function onKeyup(event:KeyboardEvent) {
      if (event.key === "Z" && event.shiftKey && event.ctrlKey) {
        if(viewModeRef.current === MENU_ITEMS.BLOG_MODE) {
          setViewMode(() => MENU_ITEMS.GRID_MODE)
        }
        else {
          setViewMode(() => MENU_ITEMS.BLOG_MODE)
        }
      }
    }

    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, [])

  useEffect(() => {    
    if (rssItemQueryResult.isFetched)
    {
      rssItemsUpdateStatusResult.mutate(rssId) 
    }
  }, [rssItemQueryResult.isFetched])

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode])

  useEffect(() => {
    clearTimeoutValidated()
  }, [rssItemQueryResult.data])

  const delayedFetch = () => {
    timeoutId.current = setTimeout(() => rssItemQueryResult.refetch().then(() => {
      fetchRetry.current += 1
      if (fetchRetry.current < MAX_RETRY) {
        return delayedFetch() 
      }
      else {
        clearTimeoutValidated()
        return true
      }
    }), 1000)
  }

  const onFeedActionChanged = (action:MENU_ITEMS) => {
    switch (action) {
      case MENU_ITEMS.REDOWNLOAD:
        rssItemDownloadResult.refetch().then((result) => {
          if (result.status == "success")
          {
            fetchRetry.current = 0
            delayedFetch()
          }
        })
        break;
      case MENU_ITEMS.BLOG_MODE: 
        setViewMode(() => MENU_ITEMS.BLOG_MODE)
        break;
      case MENU_ITEMS.GRID_MODE: 
        setViewMode(() => MENU_ITEMS.GRID_MODE)
        break;
    }
  }

  return (
    <>
        <Box position={"relative"}>
            <FeedMenu onMenuClicked={onFeedActionChanged}></FeedMenu>
        </Box>
        {
            viewMode === MENU_ITEMS.GRID_MODE ? <FeedList listData={rssItemQueryResult.data as FeedItem[]} /> : <FeedBlog listData={rssItemQueryResult.data as FeedItem[]} />
        }
    </>
  );
};

export default FeedView