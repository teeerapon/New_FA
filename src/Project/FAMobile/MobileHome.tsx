import * as React from "react";
import { Box, Stack, Card, CardHeader, Avatar, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CropFreeIcon from "@mui/icons-material/CropFree";

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

export default function RecipeReviewCard() {
  const handleCardClick = (id: number) => {
    if (id === 3) {
      window.location.href = "/ScanVerifly"; // เปิดหน้าใหม่ที่ใช้กล้องสแกน QR Code
    } else {
      alert(`คุณกดที่: ${id}`);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
      }}
    >
      <Stack spacing={2}>
        {cards.map((card, index) => (
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
    </Box>
  );
}
