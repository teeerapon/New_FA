import { GridActionsCellItem, GridCellParams, GridColDef, GridRenderCellParams, useGridApiContext } from "@mui/x-data-grid"
import DataTable from "./DataTable"
import React from "react";
import { CountAssetRow, PeriodDescription } from '../../../type/nacType';
import { Stack, Typography, AppBar, Container, Toolbar, Autocomplete, TextField, Box, FormControl, Select, SelectChangeEvent, Dialog, DialogContent, Button, DialogActions, DialogTitle, IconButton, Card } from "@mui/material";
import Swal from "sweetalert2";
import FindInPageIcon from '@mui/icons-material/FindInPage'
import Chip from '@mui/material/Chip';
import { dataConfig } from "../../../config";
import Axios from 'axios';
import { Outlet, useNavigate } from "react-router";
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ListNacPage() {

  const [openImage, setOpenImage] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null | undefined>('');

  const handleImageClick = (src: string | null | undefined) => {
    setImageSrc(src);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setImageSrc('');
  };

  // state Main
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [rows, setRows] = React.useState<CountAssetRow[]>([]);
  const [optionDct, setOptionDct] = React.useState<PeriodDescription[]>([]);
  const [optionDctString, setOptionDctString] = React.useState<string | null>('');
  const [loading, setLoading] = React.useState<boolean>(true);


  // State สำหรับการกรองแต่ละฟิลด์
  const [originalRows, setOriginalRows] = React.useState<CountAssetRow[]>([]);
  const [filterRows, setFilterRows] = React.useState<Partial<CountAssetRow>>({
    Code: undefined,
    Name: undefined,
    UserID: undefined,
    Reference: undefined,
    Position: undefined,
  });

  const searchFilterByKey = (newValue: String | null | undefined, key: keyof CountAssetRow, reason: any) => {
    const listFilter = {
      ...filterRows, [key]: ['', null, undefined].includes(newValue as string | null | undefined) ?
        undefined : newValue,
    }
    const original = originalRows;
    const filteredRows = original.filter(row => {
      return Object.keys(filterRows).every(key => {
        const fieldKey = key as keyof CountAssetRow;
        return listFilter[fieldKey] === undefined || listFilter[fieldKey] === row[fieldKey];
      });
    });
    setFilterRows(listFilter);
    setRows(filteredRows);
  };

  function SelectEditInputCellDetail(props: Readonly<GridRenderCellParams>) {
    const { id, value, field, row } = props;
    const statusAll = ['none', 'สภาพดี', 'ชำรุดรอซ้อม', 'รอตัดชำรุด', 'QR Code ไม่สมบูรณ์ (สภาพดี)', 'QR Code ไม่สมบูรณ์ (ชำรุดรอซ้อม)', 'QR Code ไม่สมบูรณ์ (รอตัดชำรุด)']
    let currentValue = value;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
      const reference: string = event.target.value;
      const referenceName: string = reference ? statusAll.find(res => res === reference) : currentValue;
      await Axios.post(`${dataConfig.http}/FA_Control_UpdateDetailCounted`, {
        roundid: optionDct && optionDctString
          ? optionDct.find(res => res.Description === optionDctString)?.PeriodID ?? 0
          : 0,
        code: row.Code,
        status: row.remarker === 'ยังไม่ได้ตรวจนับ' ? 0 : 1,
        comment: null,
        reference: referenceName === 'none' ? null : referenceName,
        image_1: row.ImagePath,
        image_2: row.ImagePath_2,
        userid: parsedData.userid,
      }, dataConfig.headers)
        .then(async res => {
          if (res.status === 200) {
            await apiRef.current.setEditCellValue({ id, field, value: referenceName });
            setRows((prevRows) =>
              prevRows.map((prevRow) =>
                prevRow.Code === row.Code ? { ...prevRow, Reference: referenceName } : prevRow
              )
            );
            setOriginalRows((prevRows) =>
              prevRows.map((prevRow) =>
                prevRow.Code === row.Code ? { ...prevRow, Reference: referenceName } : prevRow
              )
            );
            apiRef.current.stopCellEditMode({ id, field });
          }
        })
    };

    return (
      <FormControl sx={{ m: 1, maxHeight: 50 }} size="small">
        <Select
          value={currentValue}
          onChange={handleChange}
          native autoFocus
        >
          {statusAll.map(res => (
            <option key={res} value={res}>
              {!res ? 'none' : res}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderSelectEditInputCellDetail: GridColDef['renderCell'] = (params: GridRenderCellParams) => {
    return <SelectEditInputCellDetail {...params} />;
  };

  function SelectEditInputCell(props: Readonly<GridRenderCellParams>) {
    const { id, value, field, row } = props;
    const statusAll = ['ตรวจนับแล้ว', 'ยังไม่ได้ตรวจนับ', 'ต่างสาขา']
    let currentValue = value;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
      const status: string = event.target.value;
      const statusName: string = status ? statusAll.find(res => res === status) : currentValue;
      await Axios.post(`${dataConfig.http}/FA_Control_UpdateDetailCounted`, {
        roundid: optionDct && optionDctString
          ? optionDct.find(res => res.Description === optionDctString)?.PeriodID ?? 0
          : 0,
        code: row.Code,
        status: statusName === 'ยังไม่ได้ตรวจนับ' ? 0 : 1,
        comment: row.comment,
        reference: row.reference,
        image_1: row.ImagePath,
        image_2: row.ImagePath_2,
        userid: parsedData.userid,
      }, dataConfig.headers)
        .then(async res => {
          if (res.status === 200) {
            await apiRef.current.setEditCellValue({ id, field, value: statusName });
            setRows((prevRows) =>
              prevRows.map((prevRow) =>
                prevRow.Code === row.Code ? { ...prevRow, remarker: statusName } : prevRow
              )
            );
            setOriginalRows((prevRows) =>
              prevRows.map((prevRow) =>
                prevRow.Code === row.Code ? { ...prevRow, remarker: statusName } : prevRow
              )
            );
            apiRef.current.stopCellEditMode({ id, field });
          }
        })
    };

    return (
      <FormControl sx={{ m: 1, maxHeight: 50 }} size="small">
        <Select
          value={currentValue}
          onChange={handleChange}
          native autoFocus
        >
          {statusAll.map(res => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderSelectEditInputCell: GridColDef['renderCell'] = (params: GridRenderCellParams) => {
    return <SelectEditInputCell {...params} />;
  };

  function EditInputCell(props: Readonly<GridRenderCellParams>) {
    const { id, value, field, row } = props;
    const case_code: string = row.case_code;
    const [currentValue, setCurrentValue] = React.useState(value ? value.toString() : '');// สถานะสำหรับเก็บค่าแก้ไขปัจจุบัน
    const apiRef = useGridApiContext();

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const text: string = event.target.value;
      setCurrentValue(text); // อัปเดตค่าที่กำลังแก้ไขในสถานะ
      await apiRef.current.setEditCellValue({ id, field, value: text });// อัปเดตใน DataGrid ผ่าน API
    };

    const handleBlurEndEdit = async () => {
      try {
        await Axios.post(`${dataConfig.http}/FA_Control_UpdateDetailCounted`, {
          roundid: optionDct && optionDctString
            ? optionDct.find(res => res.Description === optionDctString)?.PeriodID ?? 0
            : 0,
          code: row.Code,
          status: row.remarker === 'ยังไม่ได้ตรวจนับ' ? 0 : 1,
          comment: currentValue,
          reference: row.reference,
          image_1: row.ImagePath,
          image_2: row.ImagePath_2,
          userid: parsedData.userid,
        }, dataConfig.headers)
          .then(async res => {
            if (res.status === 200) {
              await apiRef.current.setEditCellValue({ id, field, value: currentValue });
              setRows((prevRows) =>
                prevRows.map((prevRow) =>
                  prevRow.Code === row.Code ? { ...prevRow, comment: currentValue } : prevRow
                )
              );
              setOriginalRows((prevRows) =>
                prevRows.map((prevRow) =>
                  prevRow.Code === row.Code ? { ...prevRow, comment: currentValue } : prevRow
                )
              );
              apiRef.current.stopCellEditMode({ id, field });
            }
          })
      } catch (error) {
        console.error('Error occurred while updating:', error);
      }
    }

    return (
      <FormControl sx={{ m: 1, maxHeight: 50 }} size="small">
        <TextField
          id={case_code}
          variant="outlined"
          key={case_code}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlurEndEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBlurEndEdit(); // เรียกฟังก์ชันที่คุณต้องการเมื่อกด Enter
            }
          }}
          multiline
          minRows={1} // กำหนดจำนวนแถวขั้นต่ำ
          sx={{
            '& .MuiInputBase-root': {
              height: 'auto', // ให้ความสูงปรับตามเนื้อหา
            }
          }}
        />
      </FormControl>
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderEditInputCell: GridColDef['renderCell'] = (params: GridRenderCellParams) => {
    return <EditInputCell {...params} />;
  };

  const columns: GridColDef[] = [
    { field: 'Code', headerName: 'รหัสทรัพย์สิน', width: 150, headerAlign: 'center', align: 'center', },
    { field: 'Name', headerName: 'ชื่อทรัพย์สิน', width: 180, headerAlign: 'center' },
    { field: 'SerialNo', headerName: 'SerialNo', headerAlign: 'center', flex: 1, },
    { field: 'OwnerID', headerName: 'ผู้ถือครอง', width: 100, headerAlign: 'center', align: 'center', },
    // { field: 'Position', headerName: 'Location NAC', width: 100, headerAlign: 'center', align: 'center', },
    {
      field: 'Date', headerName: 'วันที่ตรวจนับ', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => params.row.Date ? dayjs(new Date(params.row.Date)).format('DD/MM/YYYY') : '',
    },
    {
      field: 'EndDate_Success', headerName: 'วันที่ทำ NAC ล่าสุด', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => params.row.Date ? dayjs(new Date(params.row.EndDate_Success)).format('DD/MM/YYYY') : '',
    },
    { field: 'UserID', headerName: 'ผู้ตรวจ', width: 100, headerAlign: 'center', align: 'center', },
    { field: 'detail', headerName: 'สถานะล่าสุด', headerAlign: 'center', flex: 1, align: 'center', },
    {
      field: 'Reference', headerName: 'สถานะครั้งนี้', headerAlign: 'center', flex: 1, align: 'center',
      renderCell: (params) => params.row.Reference ? params.row.Reference : 'none',
      renderEditCell: renderSelectEditInputCellDetail,
      editable: true,
    },
    {
      field: 'comment', headerName: 'Comment', headerAlign: 'center', flex: 1,
      editable: true,
      renderEditCell: renderEditInputCell,

    },
    {
      field: 'remarker', headerName: 'ผลการตรวจนับ', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) =>
        <Chip
          label={params.row.remarker}
          color={params.row.remarker === 'ตรวจนับแล้ว' ? 'success' : params.row.remarker === 'ยังไม่ได้ตรวจนับ' ? 'error' : 'warning'}
        />,
      renderEditCell: renderSelectEditInputCell,
      editable: true,
    },
    {
      field: 'actions', type: 'actions', width: 80, headerName: 'Img',
      cellClassName: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          key={params.row.Code}
          onClick={() => handleImageClick(params.row.ImagePath)}
          icon={<FindInPageIcon />}
          label="Image 1"
          showInMenu
        />,
        <GridActionsCellItem
          key={params.row.Code}
          onClick={() => handleImageClick(params.row.ImagePath_2)}
          icon={<FindInPageIcon />}
          label="Image 2"
          showInMenu
        />,
      ],
    },
  ];

  const handleChange = async (newValue: string | null) => {
    setLoading(true);
    setOptionDctString(newValue);

    if (newValue) {
      try {
        const resData = await Axios.post(
          `${dataConfig.http}/FA_Control_Report_All_Counted_by_Description`,
          { Description: newValue },
          dataConfig.headers
        );

        if (resData.status === 200) {
          setRows(resData.data);
          setOriginalRows(resData.data);
        } else {
          setRows([]);
          setOriginalRows([]);
        }
      } catch (error) {
        setRows([]);
        setOriginalRows([]);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setRows([]);
      setOriginalRows([]);
    }
  };



  React.useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await Axios.post(
          `${dataConfig.http}/FA_Control_Report_All_Counted_by_Description`,
          { Description: '' },
          dataConfig.headers
        );
        if (response.status === 200) {
          setLoading(false)
          setOptionDct(response.data);
        } else {
          setLoading(false)
          setRows([]);
          setOriginalRows([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [parsedData.UserCode, pathname]);

  const handleUploadFile_1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const allowedImageExtensions = ['jpg', 'png', 'gif', 'xbm', 'tif', 'pjp', 'svgz', 'jpeg', 'jfif', 'bmp', 'webp', 'svg'];

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Get file extension

      if (fileExtension && allowedImageExtensions.includes(fileExtension)) {
        const formData_1 = new FormData();
        formData_1.append("file", file);
        formData_1.append("fileName", file.name);

        try {
          const response = await Axios.post(
            // `${dataConfig.http}/check_files_NewNAC`,
            `http://vpnptec.dyndns.org:32001/api/check_files_NewNAC`,
            formData_1,
            dataConfig.headerUploadFile
          );

          const list = [...rows];
          const index = rows.findIndex(res => res.ImagePath === imageSrc || res.ImagePath_2 === imageSrc);
          if (index !== -1) {
            const matchedKey = list[index].ImagePath === imageSrc ? 'ImagePath' : 'ImagePath_2';
            list[index][matchedKey] = `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`;
            try {
              await Axios.post(`${dataConfig.http}/FA_Control_UpdateDetailCounted`, {
                roundid: optionDct && optionDctString
                  ? optionDct.find(res => res.Description === optionDctString)?.PeriodID ?? 0
                  : 0,
                code: list[index].Code,
                status: list[index].remarker === 'ยังไม่ได้ตรวจนับ' ? 0 : 1,
                comment: list[index].comment,
                reference: list[index].Reference,
                image_1: list[index].ImagePath === imageSrc ? `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}` : list[index].ImagePath,
                image_2: list[index].ImagePath === imageSrc ? list[index].ImagePath_2 : `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`,
                userid: parsedData.userid,
              }, dataConfig.headers)
                .then(() => {
                  setRows(list);
                  setOriginalRows(list);
                  setImageSrc(`http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`);
                })
            } catch (e) {
              console.error(e);
            }
          } else {
            console.error(`Index ไม่พบใน rows.`);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: 'ไฟล์ประเภทนี้ไม่ได้รับอนุญาติให้ใช้งานในระบบ \nใช้ได้เฉพาะ .csv, .xls, .txt, .ppt, .doc, .pdf, .jpg, .png, .gif',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };


  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="subtitle1" color="inherit">
            รายงานการตรวจนับทรัพย์สิน
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ my: 2 }} maxWidth="xl">
        <Grid container spacing={2} sx={{ py: 1 }}>
          <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={optionDctString}
              onChange={(e, newValue) => handleChange(newValue)}
              options={
                optionDct.filter((res) =>
                  (res.BranchID === parsedData.branchid) ||
                  (res.BranchID === 0 && parsedData.branchid !== 901) ||
                  (res.DepCode === parsedData.depcode) ||
                  (res.DepCode === parsedData.depcode)
                ).map((option) => option.Description)
              }
              renderInput={(params) => <TextField {...params} label="ค้นหาคำอธิบาย..." />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Code || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Code', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.Code).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Code" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Name || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue ?? '', 'Name', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.Name).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Name" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Reference || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue ?? '', 'Reference', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.Reference).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="สถานะครั้งนี้" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Position || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue ?? '', 'Position', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.Position).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
          </Grid>
        </Grid>
        <Card variant="outlined">
          <DataTable
            rows={rows}
            columns={columns}
            loading={loading}
            isCellEditable={function (params: GridCellParams): boolean {
              throw new Error("Function not implemented.");
            }}
          />
        </Card>
        <BootstrapDialog
          open={openImage}
          onClose={handleCloseImage}
          fullWidth
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {rows.find(res => res.ImagePath === imageSrc || res.ImagePath_2 === imageSrc)?.Code} ({rows.find(res => res.ImagePath === imageSrc || res.ImagePath_2 === imageSrc)?.Name})
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseImage}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent style={{ textAlign: 'center' }} dividers>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={imageSrc || ''}
                alt={imageSrc || ''}
                style={{ width: '100%', height: 'auto', maxWidth: '400px', maxHeight: '60vh' }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_230400022.jpg";
                }}
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                sx={{ maxWidth: '400px' }}
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <input hidden type="file" name='file' accept='image/*'
                  onChange={handleUploadFile_1}
                />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseImage}>
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <Outlet />
      </Container>
    </React.Fragment >
  );
}