import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Container } from "@mui/material";

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [qrData, setQrData] = useState<string>("");

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let stream: MediaStream | null = null; // เก็บ stream ไว้เพื่อหยุดกล้อง

    const startScanner = async () => {
      try {
        // ขอสิทธิ์เข้าถึงกล้อง
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // เริ่มอ่าน QR Code จากกล้อง
        await codeReader.decodeFromVideoDevice(
          undefined, // ใช้กล้องเริ่มต้นของอุปกรณ์
          videoRef.current!,
          (result, err) => {
            if (result) {
              setQrData(result.getText());
              // หลังจากได้ QR Code ปิดกล้อง
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
            }
          }
        );
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startScanner();

    return () => {
      // หยุดกล้องเมื่อออกจากหน้า
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Container component="main" sx={{ my: 2, }} maxWidth="xl">
      <h2>สแกน QR Code</h2>
      {!qrData && (<video ref={videoRef} style={{ width: "100%" }} autoPlay />)}
      {qrData && <p>ข้อมูลที่สแกน: {qrData}</p>}
    </Container>
  );
};

export default QRScanner;
