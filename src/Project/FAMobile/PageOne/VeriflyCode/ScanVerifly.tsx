import * as React from 'react';
import Box from "@mui/material/Box";
import { dataConfig } from "../../../../config";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Axios from 'axios';
import { AppBar, ImageList, ImageListItem, Stack, Toolbar, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Dayjs } from 'dayjs'; // Import Dayjs
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/th'
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';

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

interface ScanVeriflyProps {
  qrText: string;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface Asset {
  AssetID: string;
  Code: string;
  Name: string;
  SerialNo: string;
  BranchID: number;
  BranchName: string;
  ownerCode: string;
  ImagePath: string;
  ImagePath_2: string;
  Details: string | null;
  CreateDate: Dayjs; // หรือ Date ถ้าคุณต้องการให้เป็น Date object
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function ScanVerifly({ qrText }: Readonly<ScanVeriflyProps>) {
  const [qrData, setQrData] = React.useState<Asset[]>([]);
  const [expanded, setExpanded] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  const fetuser = async () => {
    try {
      if (qrText) {
        await Axios.post(dataConfig.http + '/check_code_result', { 'Code': qrText }, dataConfig.headers)
          .then((res) => {
            if (res.data.data.length > 0) {
              setQrData(res.data.data)
            }
          });
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const handleClickOpen = (imageUrl: string, indexData: number) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  React.useEffect(() => {
    fetuser();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: '100vw' }}>
      {qrData.length > 0 && qrData[0].Code && (
        <Card
          sx={{
            width: '100%',
            border: "1px solid #ddd", // เพิ่มขอบ
            backgroundColor: "rgba(0,121,107,0.85)", // ใช้สีพื้นหลังของ Paper
          }}
          variant='outlined'
        >
          <CardHeader
            title={<Typography variant="h6" component="div" color="white">{qrData[0].Code}</Typography>}
            subheader={<Typography variant="body1" component="div" color="white">{qrData[0].Name}</Typography>}
          />
          <ImageList cols={2}>
            <ImageListItem key={qrData[0]?.ImagePath}>
              <CardMedia
                component="img"
                height="160"
                sx={{ objectFit: 'cover', cursor: 'pointer',p:1 }}
                onClick={() => handleClickOpen(qrData[0]?.ImagePath, 0)}
                image={qrData[0]?.ImagePath || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
                }}
                alt={`${qrData[0]?.Name}_1`}
              />
            </ImageListItem>
            <ImageListItem key={qrData[0]?.ImagePath_2}>
              <CardMedia
                component="img"
                height="160"
                sx={{ objectFit: 'cover', cursor: 'pointer',p:1 }}
                onClick={() => handleClickOpen(qrData[0]?.ImagePath_2, 1)}
                image={qrData[0]?.ImagePath_2 || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
                }}
                alt={`${qrData[0]?.Name}_2`}
              />
            </ImageListItem>
          </ImageList>
          <CardContent>
            <Typography variant="body1" color="white">SerialNo: {qrData[0]?.SerialNo || '-'}</Typography>
            <Typography variant="body1" color="white">ผู้ถือครอง: {qrData[0]?.ownerCode || '-'}</Typography>
            <Typography variant="body1" color="white">สาขาที่อยู่: {qrData[0]?.BranchName || '-'} {qrData[0]?.BranchID ? `(ID=${qrData[0]?.BranchID})` : `-`}</Typography>
            <Typography variant="body1" color="white">
              วันที่ขึ้นทะเบียน: {qrData[0]?.CreateDate
                ? dayjs.tz(qrData[0].CreateDate, "Asia/Bangkok").format("YYYY-MM-DD")
                : '-'}
            </Typography>
            <Typography variant="body1" color="white">สถานะปัจจุบัน: {qrData[0]?.Details || '-'}</Typography>
          </CardContent>
        </Card>
      )}
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
    </Box>
  );
};