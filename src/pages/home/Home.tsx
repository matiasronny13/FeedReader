import TreeList from "../../components/treeList/TreeList";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ActiveTreeNode } from "../../shared/types/ActiveTreeNode";
import GroupList from "../../components/groupList/GroupList";
import FeedView from "../../components/feedList/FeedView";
import { useState } from "react";
import { SupabaseProvider } from "../../hooks/supabase/useSupabase";

const Home = () => {
  const [activeNode, setActiveNode] = useState<ActiveTreeNode>({is_group:true,id:0})

  const onActiveNodeChange = (event:ActiveTreeNode) => {
    setActiveNode(() => event)
  }

  return (
    <SupabaseProvider>
      <Grid container flex={1}>
        <Grid xs={2} sx={{backgroundColor: "background.paper"}} padding={1}>
          <TreeList onTreeNodeSelected={onActiveNodeChange}></TreeList>
        </Grid>
        <Grid flexGrow={1} padding={1}>        
          { activeNode.is_group ? <GroupList groupId={activeNode.id.toString()} /> : <FeedView rssId={activeNode.id} /> }
        </Grid>
      </Grid>
    </SupabaseProvider>
  );
};

export default Home;
