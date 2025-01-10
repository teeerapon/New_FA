
import React from "react";
import { DataGrid, GridToolbarContainer, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { AssetRecord, DataUser } from '../../../type/nacType';
import { exportToExcel } from './ExportRow';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Swal from "sweetalert2";
import Axios from 'axios';
import { dataConfig } from "../../../config";

interface DataTable {
  rows: AssetRecord[];
  users: DataUser[]
}

const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  rowSelection: false,
};

interface AssetDataExcel {
  Code: string;
  Name: string;
  OwnerCode: string;
  Asset_group: string;
  Group_name: string;
  BranchID: string;
  SerialNo?: string;
  Price: number;
  CreateDate: string;
  CreateBy: string;
  Position: string;
  TypeGroup: string;
}

interface ColumnField {
  field: string;
  width?: number;
  flex?: number;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomToolbar({ rows, users }: Readonly<DataTable>) {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [openXlsx, setOpenXlsx] = React.useState(false);
  const [arraySubmit, setArraySubmit] = React.useState<number>()
  const [nameExcel, setNameExcel] = React.useState<String>('')
  const [field, setField] = React.useState<ColumnField[]>([]);
  const [dataFile, setDataFile] = React.useState<AssetDataExcel[]>([]);
  const [syncCheck, setSyncCheck] = React.useState<boolean>(true);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const readedData = XLSX.read(data, { type: 'array', cellText: false, cellDates: true });

      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to JSON */
      const columnsHeader: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd/mm/yyyy', rawNumbers: false });
      const dataParse = XLSX.utils.sheet_to_json<AssetDataExcel>(ws, {
        range: 1,
        header: columnsHeader[0] as string[],
        raw: false,
        dateNF: 'dd/mm/yyyy',
      });

      const col = columnsHeader[0] as string[];
      const arrayField: GridColDef[] = [];

      for (let i = 0; i < col.length; i++) {
        if (col[i] === 'BranchID' || col[i] === 'Position' || col[i] === 'TypeGroup') {
          arrayField.push({
            field: col[i],
            width: 80,
          });
        } else if (col[i] === 'Code' || col[i] === 'Name' || col[i] === 'Details') {
          arrayField.push({
            field: col[i],
            width: 160,
          });
        } else if (col[i] === 'CreateDate') {
          arrayField.push({
            field: col[i],
            width: 120,
            align: 'center',
          });
        } else if (col[i] === 'OwnerCode' || col[i] === 'Asset_group' || col[i] === 'Group_name') {
          arrayField.push({
            field: col[i],
            width: 100,
          });
        } else if (col[i] === 'Price') {
          arrayField.push({
            field: col[i],
            width: 120,
            align: 'right',
            renderCell: (params) => {
              const price = params.row.Price;
              return price ? Number(price).toLocaleString('en-US') : '0';
            },
          });
        }
      }

      if (columnsHeader[0].indexOf('Code') >= 0) {
        setField(arrayField);
        setDataFile(dataParse); // `dataParse` is now of type `AssetDataExcel[]`
        setNameExcel(file.name)
        setOpenXlsx(true);
      } else {
        Swal.fire({
          icon: "error",
          title: 'ไม่พบหัวข้อรหัสทรัพย์สิน (Code !)',
          showConfirmButton: false,
          timer: 1500
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sync_data = () => {
    setOpenXlsx(false);

    // ค้นหา Code ที่ซ้ำกัน
    const duplicateCodes = rows
      .filter(row => dataFile.some(file => file.Code === row.Code))
      .map(row => row.Code);

    const duplicateUserCode = dataFile
      .filter(file => !users.some(user => file.OwnerCode === user.UserCode))
      .map(file => file.OwnerCode);

    const duplicateBrach = dataFile
      .filter(file => !users.some(user => Number(file.BranchID) === user.BranchID))
      .map(file => file.BranchID);

    Swal.fire({
      title: "Verifying Information",
      html: "It will success in <b></b> milliseconds",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const popup = Swal.getPopup();
        if (popup) {
          const timer = popup.querySelector("b");
          if (timer) {
            const interval = setInterval(() => {
              const timeLeft = Swal.getTimerLeft();
              if (timeLeft !== null) {
                timer.textContent = `${timeLeft}`;
              }
            }, 100);
            popup.addEventListener("close", () => clearInterval(interval));
          }
        }
      },
    }).then(() => {
      // ตรวจสอบเงื่อนไขและกำหนดค่าการแสดงผล
      if (duplicateCodes.length > 0 || duplicateUserCode.length > 0 || duplicateBrach.length > 0) {
        const duplicateDetails = `
          ${duplicateCodes.length > 0 ? `<h3>Code เหล่านี้มีอยู่แล้วในทะเบียน</h3><ul>${duplicateCodes.map(code => `- ${code}<br/>`).join('')}</ul>` : ''}
          ${duplicateUserCode.length > 0 ? `<h3>ไม่พบ OwnerCode ในระบบ</h3><ul>${duplicateUserCode.map(userCode => `- ${userCode}<br/>`).join('')}</ul>` : ''}
          ${duplicateBrach.length > 0 ? `<h3>ไม่พบ BranchID ในระบบ</h3><ul>${duplicateBrach.map(branch => `- ${branch}<br/>`).join('')}</ul>` : ''}
        `;

        Swal.fire({
          icon: "warning",
          title: `พบปัญหาบางอย่างในข้อมูล`,
          html: duplicateDetails,
          showConfirmButton: true,
        }).then(() => setOpenXlsx(true));
      } else {
        Swal.fire({
          icon: "success",
          title: "ยินดีด้วย ไม่พบข้อมูลซ้ำซ้อน",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          setSyncCheck(false)
          setOpenXlsx(true)
        }
        );
      }
    });
  };


  const handleSubmitXlsx = async () => {
    try {
      setOpenXlsx(false);
      const resTAB = await Axios.post(
        dataConfig.http + '/FA_Control_BPC_Running_NO'
        , parsedData
        , dataConfig.headers
      )
      const keyID = resTAB.data[0].TAB;
      for (let i = 0; i < dataFile.length; i++) {
        const body = {
          ...dataFile[i],
          UserCode: parsedData.UserCode,
          keyID,
        };
        const response = await Axios.post(
          `${dataConfig.http}/FA_Control_New_Assets_Xlsx`,
          body,
          dataConfig.headers
        );
        if (response.data[0]?.res) {
          setOpenXlsx(false);
          Swal.fire({
            icon: "error",
            title: response.data[0].res,
            showConfirmButton: false,
            timer: 500,
          })
          return;
        } else {
          setArraySubmit((i / (dataFile.length - 1)) * 100);
          if (i === dataFile.length - 1) {
            const finalBody = { count: dataFile.length, keyID };
            const finalResponse = await Axios.post(
              `${dataConfig.http}/FA_Control_import_dataXLSX_toAssets`,
              finalBody,
              dataConfig.headers
            );
            if (finalResponse.data[0]?.response === "ทำรายการสำเร็จ") {
              Swal.fire({
                icon: "success",
                title: response.data[0].res,
                showConfirmButton: false,
                timer: 500,
              })
            } else if (finalResponse.data[0]?.response) {
              setOpenXlsx(false);
              Swal.fire({
                icon: "error",
                title: finalResponse.data[0].response,
                showConfirmButton: false,
                timer: 500,
              })
            } else {
              setOpenXlsx(false);
              Swal.fire({
                icon: "error",
                title: finalResponse.data,
                showConfirmButton: false,
                timer: 500,
              })
            }
          }
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  return (
    <React.Fragment>
      <Box component="main">
        <GridToolbarContainer >
          <Button
            size="small"
            color="primary"
            startIcon={<SystemUpdateAltIcon />}
            component="label"
            disabled={rows.length === 0}
          >
            <div>Import Data</div>
            <input hidden multiple type="file" onChange={fileSelected} />
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {rows && (
            <Button size="small" color="primary" startIcon={<SystemUpdateAltIcon />}
              onClick={() => exportToExcel(rows)}
              disabled={rows.length === 0}
            >
              Export
            </Button>
          )}
        </GridToolbarContainer>
        <Divider />
      </Box>
      <BootstrapDialog
        onClose={() => {
          setOpenXlsx(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={openXlsx}
        fullWidth
        maxWidth='lg'
      >
        {
          !arraySubmit ?
            <DialogTitle>
              <Typography variant="subtitle1" gutterBottom>
                ต้องการอัปโหลดไฟล์ [{nameExcel}] ไปที่ข้อมูลหลักใช่หรือไม่ ?
              </Typography>
            </DialogTitle>
            :
            <DialogTitle>
              <Typography variant="subtitle1" gutterBottom>
                กำลังอัปโหลดข้อมูล กรุณาอย่าปิดหน้าจอนี้ !!
              </Typography>
            </DialogTitle>
        }
        <DialogContent>
          <Box sx={{ height: 480, width: '100%' }}>
            <DataGrid
              columns={field}
              rows={dataFile}
              getRowId={(row) => row.Code}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" sx={{ textTransform: 'none', }} onClick={sync_data}>Sync Data</Button>
            <Button variant="outlined" sx={{ textTransform: 'none', }} color="success" onClick={handleSubmitXlsx} disabled={syncCheck}>Upload Data</Button>
            <Button variant="outlined" sx={{ textTransform: 'none', }} color="error" onClick={() => setOpenXlsx(false)}>Cancel</Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}