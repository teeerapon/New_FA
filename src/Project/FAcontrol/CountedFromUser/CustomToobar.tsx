import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button, Dialog, DialogContent, styled } from '@mui/material';
import { CountAssetRow } from '../../../type/nacType';
import { exportToExcel } from './ExportRow';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import React from 'react';
import dayjs from 'dayjs';

interface DataTable {
  rows: CountAssetRow[];
  dataSelect: CountAssetRow[];
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  rowSelection: false,
};

export default function CustomToolbar({ rows, dataSelect }: Readonly<DataTable>) {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    { field: 'Code', headerName: 'รหัสทรัพย์สิน', width: 150, headerAlign: 'center', align: 'center', },
    { field: 'Name', headerName: 'ชื่อทรัพย์สิน', width: 180, headerAlign: 'center' },
    { field: 'SerialNo', headerName: 'SerialNo', headerAlign: 'center', flex: 1, },
    { field: 'OwnerID', headerName: 'ผู้ถือครอง', width: 100, headerAlign: 'center', align: 'center', },
    { field: 'Position', headerName: 'Location', width: 100, headerAlign: 'center', align: 'center', },
    {
      field: 'Date', headerName: 'วันที่ตรวจนับ', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => params.row.Date ? dayjs(new Date(params.row.Date)).format('DD/MM/YYYY') : '',
    },
    { field: 'Reference', headerName: 'สถานะครั้งนี้', headerAlign: 'center', flex: 1, align: 'center', },
    { field: 'comment', headerName: 'Comment', headerAlign: 'center', flex: 1, },
  ]

  return (
    <React.Fragment>
      <Box component="main">
        <GridToolbarContainer >
          <Button
            size="small"
            color="primary"
            startIcon={<SystemUpdateAltIcon />}
            disabled={dataSelect.length === 0}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Create Nac
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {rows && (
            <Button size="small" color="primary" startIcon={<SystemUpdateAltIcon />}
              onClick={() => exportToExcel(rows)}
            >
              Export
            </Button>
          )}
        </GridToolbarContainer>
        <Divider />
      </Box>
      <BootstrapDialog
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        fullWidth
        maxWidth='lg'
      >
        <DialogContent>
          <DataGrid
            columns={columns}
            rows={dataSelect}
            getRowId={(row) => row.Code!}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
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
            // getRowHeight={() => 'auto'}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
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
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}