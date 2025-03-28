import * as React from "react";
import { Box, Stack, Card, CardHeader, Avatar, Typography, AppBar, Toolbar, IconButton, Container } from "@mui/material";
import { red } from "@mui/material/colors";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CropFreeIcon from "@mui/icons-material/CropFree";
import { BrowserQRCodeReader } from "@zxing/browser";
import ScanVerifly from './VeriflyCode/ScanVerifly';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import NavBarMobile from './NavMain/NavbarMobile'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

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

const cards = [
  {
    id: 1,
    title: "ตรวจนับทรัพย์สิน",
    description: "Go to Count Assets.",
    icon: <QrCodeIcon />,
  },
  {
    id: 2,
    title: "ทรัพย์สินทั้งหมดของฉัน",
    description: "View My Assets.",
    icon: <EventNoteIcon />,
  },
  {
    id: 3,
    title: "ตรวจสอบคิวอาร์โค้ด",
    description: "Verify QR Code.",
    icon: <CropFreeIcon />,
  },
];

export default function RecipeReviewCard(props: Props) {
  const theme = useTheme();
  const [qrData, setQrData] = React.useState<string>("");

  const handleCardClick = (id: number) => {
    if (id === 3) {
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
                setQrData(result.getText());
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
    } else if (id === 2) {
      window.location.href = '/MyAssets';
    }
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
                  window.location.href = '/MobileHome';
                }}
                sx={{ color: 'black' }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" color="inherit" component="div">
              หน้าแรก
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 16, sm: 22 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              py: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            }}
          >
            <Stack direction="column" spacing={2}>
              {!qrData && cards.map((card, index) => (
                <Card
                  key={index}
                  sx={{
                    width: "95vw",
                    backgroundColor: "rgba(0,121,107,1)",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,121,107,0.85)",
                      transform: "scale(1.03)",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }}>{card.icon}</Avatar>}
                    title={<Typography color="white">{card.title}</Typography>}
                    subheader={<Typography color="white">{card.description}</Typography>}
                  />
                </Card>
              ))}
            </Stack>
            {qrData && (<ScanVerifly qrText={qrData} />)}
            <ScrollTop {...props}>
              <Fab size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
}
