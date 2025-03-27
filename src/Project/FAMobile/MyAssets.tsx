import { GridCellParams, GridColDef } from "@mui/x-data-grid"
import React from "react";
import { Stack, Typography, AppBar, Container, Toolbar, Autocomplete, TextField, Box, ImageListItem, CardActionArea, CardContent, ImageList, Pagination, CardMedia, Tab, Tabs, CircularProgress, IconButton, CardHeader } from "@mui/material";
import Axios from 'axios';
import { Outlet, useNavigate } from "react-router";
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import ImageCell from "./ClickOpenImg";
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { dataConfig } from "../../config";
import { AssetRecord, Assets_TypeGroup } from "../../type/nacType";
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

function ScrollTop(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(1),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    // boxShadow: `0 2px 10px ${theme.palette.primary.main}33`,
  },
}));


export default function MyAssets(props: Props) {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [rows, setRows] = React.useState<AssetRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [assets_TypeGroup, setAssets_TypeGroup] = React.useState<Assets_TypeGroup[]>([]);
  const [assets_TypeGroupSelect, setAssets_TypeGroupSelect] = React.useState<string | null>(null);

  // State สำหรับการกรองแต่ละฟิลด์
  const [originalRows, setOriginalRows] = React.useState<AssetRecord[]>([]);
  const [filter, setFilter] = React.useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true)
      const resFetchAssets = await Axios.get(dataConfig.http + '/FA_Control_Assets_TypeGroup', dataConfig.headers)
        .then(async (res) => {
          if (res.status === 200) {
            const response = await Axios.post(`${dataConfig.http}/FA_Control_Fetch_Assets`, { usercode: parsedData.UserCode }, dataConfig.headers);
            if (response.status === 200) {
              const dataLog: AssetRecord[] = response.data.filter((res: AssetRecord) => res.typeCode === resData[0].typeCode && res.OwnerID === parsedData.UserCode)
              const resData: Assets_TypeGroup[] = res.data
              setLoading(false)
              setRows(dataLog)
              setOriginalRows(dataLog)
              setAssets_TypeGroup(resData)
              setAssets_TypeGroupSelect(resData[0].typeCode)
            } else {
              setLoading(false)
              setRows([]);
              setOriginalRows([])
            }
          }
        })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
          <IconButton
            onClick={() => {
              window.location.href = '/MobileHome';
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="subtitle1" color="inherit">
            ทะเบียนทรัพย์สินทั้งหมด
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Box sx={{ display: "flex", flexDirection: "column", width: '100vw', py: 1, px: 2 }}>
        <Tabs
          // originalRows
          value={assets_TypeGroupSelect}
          onChange={(event: React.SyntheticEvent, newValue: string) => {
            const typeFil = originalRows.filter(res => res.typeCode === newValue && res.OwnerID === parsedData.UserCode)
            setRows(typeFil); // อัปเดต rows หลังจาก filter เปลี่ยนแปลง
            setAssets_TypeGroupSelect(newValue);
          }}
        >
          {assets_TypeGroup.map((res) => (
            <Tab
              label={`${res.typeCode}`}
              value={res.typeCode}
              key={res.typeGroupID}
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40vh', // ให้ครอบคลุมทั้งหน้าจอ
            }}
          >
            <Stack sx={{ justifyContent: "center", alignItems: "center", }}>
              <CircularProgress color="inherit" />
            </Stack>
          </Box>
        )}
        <Stack direction="column" spacing={1}>
          {!loading && rows.map((res, index) => (
            <Card
              sx={{
                width: '100%',
                border: "1px solid #ddd", // เพิ่มขอบ
                backgroundColor: "rgba(0,121,107,0.85)", // ใช้สีพื้นหลังของ Paper
              }}
              variant='outlined'
            >
              <CardHeader
                title={<Typography variant="h6" component="div" color="white">{res.Code}</Typography>}
                subheader={<Typography variant="body1" component="div" color="white">{res.Name}</Typography>}
              />
              <ImageList sx={{ height: 140, objectFit: 'cover', cursor: 'pointer' }} cols={2}>
                <div>
                  <ImageCell
                    imagePath={res.ImagePath ?? 'http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg'}
                    name={'Image 1'}
                    originalRows={originalRows}
                    rows={rows}
                    index={index}
                    fieldData={`ImagePath`}
                    setRows={setRows}
                    setOriginalRows={setOriginalRows}
                  />
                </div>
                <div>
                  <ImageCell
                    imagePath={res.ImagePath_2 ?? 'http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg'}
                    name={'Image '}
                    originalRows={originalRows}
                    rows={rows}
                    index={index}
                    fieldData={`ImagePath_2`}
                    setRows={setRows}
                    setOriginalRows={setOriginalRows}
                  />
                </div>
              </ImageList>
              <CardContent>
                <Typography variant="body1" color="white">SerialNo: {res.SerialNo || '-'}</Typography>
                <Typography variant="body1" color="white">ผู้ถือครอง: {res.OwnerID} ({res.Position})</Typography>
                <Typography variant="body1" color="white">Asset Group: {res.Asset_group || '-'}</Typography>
                <Typography variant="body1" color="white">Group Name: {res.Group_name || '-'}</Typography>
                <Typography variant="body1" color="white">สถานะปัจจุบัน: {res.Details}</Typography>
                <Typography variant="body1" color="white">NAC STATUS: {res.nac_processing ? `ถูกใช้งานที่ ${res.nac_processing}` : '-'}</Typography>
              </CardContent>
            </Card>
          ))}
          <ScrollTop {...props}>
            <Fab size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Stack>
        <Outlet />
      </Box>
    </React.Fragment >
  );
}