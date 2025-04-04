import * as React from 'react';
import Box from "@mui/material/Box";
import { dataConfig } from "../../../../config";
import { styled, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Axios from 'axios';
import { AppBar, ImageList, ImageListItem, Stack, Toolbar, Dialog, DialogContent, Container, ThemeProvider, Tooltip, Button, DialogActions, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Dayjs } from 'dayjs'; // Import Dayjs
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/th'
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { Outlet, useLocation, useNavigate } from "react-router";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NavBarMobile from '../../NavMain/NavbarMobile'
import { CountAssetRow } from '../../../../type/nacType';
import Swal from 'sweetalert2';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { BrowserQRCodeReader } from '@zxing/browser';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export default function ScanVerifly() {
  const location = useLocation();
  const navigate = useNavigate();
  const dataLocation = location.state;
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [qrData, setQrData] = React.useState<CountAssetRow>({
    Code: '',
    Name: '',
    BranchID: 0,
    OwnerID: '',
    Position: '',
    Date: dayjs(Date.now()),
    EndDate_Success: dayjs(Date.now()),
    UserID: '',
    detail: '',
    Reference: '',
    comment: '',
    remarker: '',
    RoundID: '',
    RowID: 0,
    typeCode: '',
    ImagePath: '',
    ImagePath_2: '',
  });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const dataFix = ['ไม่ได้ระบุสถานะ', 'สภาพดี', 'ชำรุดรอซ่อม', 'รอตัดขาย', 'รอตัดชำรุด', 'อื่น ๆ']
  const [dialogFixed, setDialogFixed] = React.useState<boolean>(false);
  const [valueChoice, setValueChoice] = React.useState(qrData && qrData.Reference || 'ไม่ได้ระบุสถานะ');

  const fechData = async () => {
    try {
      if (dataLocation?.Code) {
        const resCheck = await Axios.post(dataConfig.http + '/check_code_result', { 'Code': dataLocation?.Code }, dataConfig.headers)
        if (resCheck.status === 200) {
          if (resCheck.data.data.length > 0) {
            console.log(resCheck.data.data);
            try {
              const resAdd = await Axios.post(dataConfig.http + '/addAsset',
                {
                  "Name": resCheck.data.data[0]['Name'],
                  "Code": resCheck.data.data[0]["Code"],
                  "BranchID": resCheck.data.data[0]['BranchID'],
                  "Date": dayjs(Date.now()),
                  "UserBranch": dataLocation?.branchSelect,
                  "Reference": 'ยังไม่ได้ระบุสถานะ',
                  "Status": 1,
                  "RoundID": dataLocation?.PeriodID,
                  "UserID": parsedData?.userid,
                },
                dataConfig.headers)
              if (resAdd.status === 200) {
                setQrData((prev) => ({
                  ...prev,
                  Code: resCheck.data.data[0]["Code"],
                  Name: resCheck.data.data[0]['Name'],
                  BranchID: resCheck.data.data[0]['BranchID'],
                  detail: resCheck.data.data[0]['Details'] || '-',
                  OwnerID: resCheck.data.data[0]['ownerCode'],
                  typeCode: resCheck.data.data[0]['typeCode'],
                  Position: resCheck.data.data[0]['Position'],
                  Date: dayjs(Date.now()),
                  UserID: parsedData?.UserCode,
                  Reference: 'ยังไม่ได้ระบุสถานะ',
                  remarker: 'ตรวจนับแล้ว',
                }))
              }
            } catch (e) {
              console.log(e)
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: `ไม่พบทรัพย์รหัส : ${dataLocation?.Code}`,
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const updateReferent = async (value: string) => {
    const response = await Axios.post(
      `${dataConfig.http}/updateReference`,
      {
        "Reference": value,
        "Code": qrData.Code,
        "RoundID": qrData.RoundID,
        "UserID": parsedData.userid,
        "BranchID": qrData.BranchID,
        "Date": dayjs(Date.now()),
      },
      dataConfig.headers
    );
    if (response.status === 200) {
      setQrData((prev) => ({ ...prev, Reference: value }))
    } else {
      Swal.fire({
        icon: "warning",
        title: 'ไม่สามารถเปลี่ยนแปลงได้ ลองใหม่อีกครั้ง',
        showConfirmButton: false,
        timer: 1500
      }).then(() => setValueChoice('ยังไม่ได้ระบุสถานะ'));
    }
  }

  React.useEffect(() => {
    fechData();
  }, []);

  const handleCardClick = (id: number) => {
    // แสดงตัวเลือกให้ผู้ใช้เลือกแหล่งที่มาของรูปภาพ
    const choice = window.confirm("คุณต้องการถ่ายรูปจากกล้องหรืออัปโหลดจากอุปกรณ์?\n\nกด 'ตกลง' เพื่อถ่ายรูป หรือ 'ยกเลิก' เพื่ออัปโหลด");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    if (choice) {
      fileInput.capture = "camera"; // เปิดกล้องถ่ายรูป
    }

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // อ่าน QR Code จากรูปภาพ
        const reader = new BrowserQRCodeReader();
        reader.decodeFromImageUrl(URL.createObjectURL(file))
          .then(result => {
            if (result.getText()) {
            } else {
              alert("ไม่สามารถอ่าน QR Code ได้ กรุณาลองใหม่อีกครั้ง");
            }
          })
          .catch(err => {
            console.error("Error reading QR Code:", err);
            alert("ไม่สามารถอ่าน QR Code ได้ กรุณาลองใหม่อีกครั้ง");
          });
      }
    };

    fileInput.click();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
        >
          <NavBarMobile />
          <Toolbar id="back-to-top-anchor" sx={{ backgroundColor: '#f5f5f5', color: 'black' }}>
            {qrData && (
              <IconButton
                onClick={() => {
                  navigate('/MobilePageTwoScanRound', { state: { branchSelect: dataLocation?.branchSelect } });
                }}
                sx={{ color: 'black' }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" color="inherit" component="div">
              ผลลัพธ์การสแกน
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 8, sm: 12 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", width: '100vw' }}>
              {qrData && qrData.Code && (
                <Card
                  sx={{
                    width: '100%',
                    border: "1px solid #ddd", // เพิ่มขอบ
                    backgroundColor: "rgba(0,121,107,0.85)", // ใช้สีพื้นหลังของ Paper
                  }}
                  variant='outlined'
                >
                  <CardHeader
                    title={<Typography variant="h6" component="div" color="white">{qrData.Code}</Typography>}
                    subheader={<Typography variant="body1" component="div" color="white">{qrData.Name}</Typography>}
                    action={
                      <Tooltip title="แก้ไขรายละเอียด">
                        <IconButton
                          aria-label="add to favorites"
                          onClick={() => {
                            setQrData(qrData)
                            setDialogFixed(true)
                          }}
                        >
                          <AutoFixHighIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <ImageList cols={2}>
                    <ImageListItem>
                      <CardMedia
                        component="img"
                        height="160"
                        sx={{ objectFit: 'cover', cursor: 'pointer', p: 1 }}
                        // onClick={() => handleClickOpen(qrData?.ImagePath, 0)}
                        image={qrData?.ImagePath || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
                        }}
                        alt={`${qrData?.Name}_1`}
                      />
                    </ImageListItem>
                    <ImageListItem>
                      <CardMedia
                        component="img"
                        height="160"
                        sx={{ objectFit: 'cover', cursor: 'pointer', p: 1 }}
                        // onClick={() => handleClickOpen(qrData?.ImagePath_2, 1)}
                        image={qrData?.ImagePath_2 || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
                        }}
                        alt={`${qrData?.Name}_2`}
                      />
                    </ImageListItem>
                  </ImageList>
                  <CardContent>
                    <Typography variant="body1" color="white">ผู้ถือครอง: {qrData.OwnerID} ({qrData.Position})</Typography>
                    <Typography variant="body1" color="white">ประเภท: {qrData.typeCode || '-'}</Typography>
                    <Typography variant="body1" color="white">สถานะปัจจุบัน: {qrData.detail || '-'}</Typography>
                    <Typography variant="body1" color="white">ผู้ตรวจนับ: {qrData.UserID || '-'}</Typography>
                    <Typography variant="body1" color="white">วันที่ตรวจนับ: {dayjs(qrData.Date).format('DD/MM/YYYY HH:mm')}</Typography>
                    <Typography variant="body1" color="white">สถานะครั้งนี้: {qrData.Reference || '-'}</Typography>
                    <Typography variant="body1" color="white">หมายเหตุ: {qrData.remarker || '-'}</Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <BootstrapDialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpenDialog(false)
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ textAlign: 'center' }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedImage || ''}
              style={{ width: '100%', height: 'auto' }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
              }}
            />
          </Stack>
        </DialogContent>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={() => {
          setDialogFixed(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={dialogFixed}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          แก้ไขรายการ
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setDialogFixed(false);
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">{qrData && qrData.Reference}</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={valueChoice}
              name="radio-buttons-group"
              value={valueChoice}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValueChoice((event.target as HTMLInputElement).value);
                updateReferent((event.target as HTMLInputElement).value)
              }}
            >
              {dataFix.map((dataFix, index) => (
                <FormControlLabel
                  key={index}
                  value={dataFix}
                  control={<Radio />}
                  label={dataFix}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogFixed(false)
            }}
          >
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Outlet />
    </Box>
  );
};