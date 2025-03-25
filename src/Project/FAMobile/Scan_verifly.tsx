import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { Box, Container, Typography } from "@mui/material";

const CameraScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  // ดึงรายการอุปกรณ์กล้อง
  useEffect(() => {
    const getDevices = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const deviceInfos = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');

          if (videoDevices.length > 0) {
            startCamera(videoDevices[0].deviceId); // เริ่มต้นกล้อง
          } else {
            console.error("No video devices found.");
            alert("ไม่พบกล้องในอุปกรณ์นี้");
            window.location.href = "/MobileHome"; // นำทางไปหน้าใหม่
          }
        } catch (err) {
          console.error("Error accessing media devices: ", err);
          alert("ไม่สามารถเข้าถึงกล้องได้");
          window.location.href = "/MobileHome"; // นำทางไปหน้าใหม่
        }
      } else {
        console.error("Media Devices API is not available.");
        alert("ไม่สามารถเข้าถึงกล้องได้");
        window.location.href = "/MobileHome"; // นำทางไปหน้าใหม่ที่ใช้กล้องสแกน QR Code
      }
    };

    getDevices();
  }, []);

  // เริ่มต้นการเปิดกล้องตามที่เลือก
  const startCamera = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }, // ใช้ deviceId ของกล้องที่เลือก
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      requestAnimationFrame(scanQRCode); // เริ่มการสแกน QR Code
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("ไม่สามารถเข้าถึงกล้องได้");
      window.location.href = "/MobileHome"; // เปิดหน้าใหม่ที่ใช้กล้องสแกน QR Code
    }
  };

  // ฟังก์ชันสแกน QR Code
  const scanQRCode = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setQrCodeData(code.data); // แสดงผล QR Code ที่สแกน
        }
      }
      requestAnimationFrame(scanQRCode);
    }
  };

  return (
    <Container component="main" sx={{ my: 2 }} maxWidth="xl">
      <Typography variant="h4" gutterBottom>QR Code Scanner</Typography>

      {/* Video element สำหรับแสดงภาพจากกล้อง */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '600px' }}></video>
      </Box>

      {/* แสดงผลข้อมูลที่ได้จาก QR Code */}
      {qrCodeData && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Scanned QR Code Data:</Typography>
          <Typography variant="body1">{qrCodeData}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default CameraScanner;
