import * as React from 'react';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { AssetRecord, DataUser, Assets_TypeGroup } from '../../../type/nacType';
import CustomToolbar from './CustomToobar';

interface DataTableProps {
  columns: GridColDef[];
  rows: AssetRecord[];
  loading: boolean;
  users: DataUser[];
  assets_TypeGroup: Assets_TypeGroup[]
  isCellEditable: (params: GridCellParams) => boolean;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  fetchData: () => Promise<void>;
}

const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  rowSelection: false,
};

const PAGE_SIZE = 20;

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}

export default function AntDesignGrid({ rows, columns, loading, users, assets_TypeGroup, setTimer, fetchData }: Readonly<DataTableProps>) {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  return (
    <Box style={{ width: '100%' }}>
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[PAGE_SIZE]}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.Code}
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                size: 'small',
              },
              columnInputProps: {
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  size: 'small',
                },
              },
            },
          },
        }}
        getRowHeight={() => 'auto'}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: () => <CustomToolbar rows={rows} users={users} assets_TypeGroup={assets_TypeGroup} setTimer={setTimer} fetchData={fetchData}/>,
        }}
        sx={(theme) => ({
          '--DataGrid-overlayHeight': '300px',
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #303030',
            color: '#f0f0f0',
            backgroundColor: '#303030',
            ...theme.applyStyles('light', {
              borderRightColor: '#f0f0f0',
            }),
          },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        })}
        density="compact"
        {...other}
      />
    </Box>
  );
}
