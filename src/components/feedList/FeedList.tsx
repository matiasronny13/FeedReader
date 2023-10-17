import { Box, Link } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FeedItem } from "../../shared/types/FeedItem";
import { forwardRef } from "react";

type TProps = {
    listData: FeedItem[]
}

const columns: GridColDef[] = [
    { field: 'pub_date', 
      headerName: 'Published', 
      width: 190, 
      valueFormatter: params => new Date(params.value).toLocaleString('fr-FR')},
    { field: 'title', 
      headerName: 'Title', 
      width: 1300,
      renderCell: (params) =>   <Link target="_blank"
                                      rel="noreferrer" 
                                      sx={{textDecoration: "none", '&:hover': {textDecoration: 'underline'}, color: `${params.row.has_read ? 'auto' : '#FFA726'}`}} 
                                      href={params.row.link} color="inherit">{params.row.title}
                                </Link>
    }
];

const FeedList = ({listData}:TProps) => {

    return <Box sx={{width:"100%", height:"840px"}}>
        { 
            listData &&
            <DataGrid 
                rows={listData}
                columns={columns}
                rowSelection={true}
                rowHeight={25}
                columnHeaderHeight={30}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
                slots={{ columnHeaders: forwardRef(() => null) }}
                hideFooterSelectedRowCount
            />
        }
    </Box>
}

export default FeedList;