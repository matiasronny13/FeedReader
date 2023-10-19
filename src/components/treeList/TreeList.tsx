import { Box, Icon, Tooltip, Typography } from "@mui/material";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import { ActiveTreeNode } from "../../shared/types/ActiveTreeNode";
import useRssQuery from "../../hooks/supabase/useRssQuery";

interface RenderTree {
    id: number;
    name: string;
    jobId:string;
    children?: readonly RenderTree[];
    has_read: boolean;
}
  
type Props = {
    onTreeNodeSelected: (event:ActiveTreeNode) => void
}

const TreeList = ({onTreeNodeSelected}:Props) => {
  const rssQueryResult = useRssQuery();
  
  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}      
      nodeId={nodes.id.toString()}
      label={
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Box>
          <Typography
            width={195}
            sx={{ fontSize: 14 ,overflow: 'hidden', color: `${nodes.has_read ? 'auto' : '#FFA726'}`,
            textOverflow: 'ellipsis',
            display: '-webkit-box', 
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical'}}>
            <span title={nodes.name}>{nodes.name}</span>
          </Typography>
          </Box>
          {
            (nodes.jobId == '0') &&             
            <Tooltip title="Manual Download">
              <Box borderRadius={5} style={{width: "7px", height: "7px", backgroundColor: '#fc4c63'}}>&nbsp;</Box>
            </Tooltip>
          }
        </Box>
      }
      onClick={() => onTreeNodeSelected({is_group: nodes.children != undefined, id: nodes.id})}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Box sx={{height: "840px", overflow: "hidden", overflowY: "auto"}}>
      <TreeView
        defaultCollapseIcon={<Icon>remove_circle_outline</Icon>}
        defaultExpanded={["root"]}
        defaultExpandIcon={<Icon>add_circle</Icon>}
      >
        {rssQueryResult.data && renderTree(rssQueryResult.data)}
      </TreeView>
    </Box>
  );
};

export default TreeList;
