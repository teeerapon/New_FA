import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

const QRScanner: React.FC<{ onResult: (result: string) => void }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanResult, setScanResult] = React.useState<string | null>(null);

  useEffect(() => {
    const scan = async () => {
      const codeReader = new BrowserQRCodeReader();
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;

      if (deviceId && videoRef.current) {
        try {
          const result = await codeReader.decodeOnceFromVideoDevice(
            deviceId,
            videoRef.current
          );
          setScanResult(result.getText());
        } catch (err) {
          console.error('QR scan error:', err);
        }
      }
    };

    scan();
  }, [onResult]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', maxWidth: 400, border: '1px solid #ccc' }} />
      {scanResult && (
        <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'green' }}>
          ✅ สแกนสำเร็จ: <strong>{scanResult}</strong>
        </div>
      )}
    </div>
  );;
};

export default QRScanner;
