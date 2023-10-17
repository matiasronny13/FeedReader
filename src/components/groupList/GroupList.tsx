import { Box, Button, Icon } from "@mui/material";
import useRssByGroupQuery from "../../hooks/supabase/useRssByGroupQuery";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel, GridToolbarContainer, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Rss } from "../../shared/types/Rss";
import useRssGroupsQuery from "../../hooks/supabase/useRssGroupsQuery";
import useRssDelete from "../../hooks/supabase/useRssDelete";
import useRssUpsert from "../../hooks/supabase/useRssUpsert";

type Props = {
  groupId: string
}

interface EditToolbarProps {
  onAddClick: () => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { onAddClick } = props;

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Icon>add</Icon>} onClick={onAddClick}>
        Add Feed
      </Button>
    </GridToolbarContainer>
  );
}

const GroupList = ({ groupId }: Props) => {
  const gridApiRef = useGridApiRef()
  const rssByGroupQueryResult = useRssByGroupQuery(groupId)
  const rssGroupsQueryResult = useRssGroupsQuery()
  const rssDeleteResult = useRssDelete()

  const [rows, setRows] = useState<Rss[]>([]);
  useEffect(() => { setRows(() => rssByGroupQueryResult.data ?? []) }, [rssByGroupQueryResult.data])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const columns: GridColDef[] = [
    {
      field: 'url',
      headerName: 'URL',
      width: 600,
      editable: true
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      editable: true
    },
    {
      field: 'group_id',
      headerName: 'Group',
      width: 200,
      editable: true,
      type: "singleSelect",      
      valueGetter: (e) => { return e.row.group_id ?? ""; }
    },
    {
      field: 'job_id',
      headerName: 'Job',
      width: 200,
      editable: true,
      type: "singleSelect",
      valueGetter: (e) => { return e.row.job_id ?? ""; }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Icon>save</Icon>}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={onSaveRow(id)}
            />,
            <GridActionsCellItem
              icon={<Icon>cancel</Icon>}
              label="Cancel"
              onClick={onCancelRow(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Icon>delete</Icon>}
            label="Delete"
            color="secondary" 
            onClick={onDeleteRow(id)}
          />,          
          <GridActionsCellItem
            icon={<Icon></Icon>}
            label="Edit"
          />
        ];
      },
    }
  ];

  const getColumnDefinition:GridColDef<Rss>[] = 
        columns.map(c => (c.field != "job_id") ? c : {...c, valueOptions: [...Array(10)].map((_, id) => ({value: id.toString(), label: id === 0 ? 'Manual' : id}))})
        .map(c => (c.field != "group_id") ? c : {...c, valueOptions: rssGroupsQueryResult.data?.map(d => ({value: d.id, label: d.name}))})

  const onAddClick = () => {
    const newId = -1

    setRows((prevRows) => [...prevRows, {id:newId, group_id:groupId, job_id: '0', is_new: true}]);
    
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'url' },
    }));
  }
  
  const onDeleteRow = (id: GridRowId) => () => {
    rssDeleteResult.mutate(id as number)
  }

  const onCancelRow = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.is_new) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const rssUpsertResult = useRssUpsert()
  const onSaveRow = (id: GridRowId) => () => {
    const rowData = gridApiRef.current.getRowWithUpdatedValues(id, "")
    rssUpsertResult.mutateAsync({...rowData, is_new: undefined, id: (rowData.is_new ? undefined : rowData.id)}).then((result) => {
      console.log(result)
    })

    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: false },
    });
  };
  
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
    setRows(rows.filter((row) => row.id != -1));
  };

  return (
    <Box>
      <DataGrid
        getRowId={(row:Rss) => row.id ?? 0}
        apiRef={gridApiRef}
        rows={rows}
        columns={getColumnDefinition}
        rowSelection={true}
        rowHeight={25}
        columnHeaderHeight={30}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { onAddClick },
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </Box>
  )
}

export default GroupList;