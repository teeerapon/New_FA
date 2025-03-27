import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login'; // เปลี่ยนเส้นทางให้ตรงกับที่อยู่ของไฟล์ Login.tsx
import Home from './Dashboard/home3'; // ตัวอย่างไฟล์หน้า Home
import NavBar from './components/Navbar';
import Crate from './Project/FAcontrol/CreateNAC/Create'; // ตัวอย่างไฟล์หน้า Home
import ListNacPage from './Project/FAcontrol/ListNAC/ListNacPage';
import ListPeriod from './Project/FAcontrol/Period/ListPeriod';
import CreatePeriod from './Project/FAcontrol/Period/CreatePeriod';
import HistoryList from './Project/FAcontrol/HistoryList/HistoryList';
import MainEbookAssets from './Project/FAcontrol/ListEbook/mainAssets';
import MainListCountedAssets from './Project/FAcontrol/ListFromCounted/mainAssets';
import SelectBU from './Project/FAcontrol/CountedFromUser/SelectBU';
import MainAssets from './Project/FAcontrol/ListAssets/mainAssets';
import Profile from './Account/profile';
import ControlSection from './controlSection/main'
import MobileHome from './Project/FAMobile/MobileHome';
import NavbarMobile from './components/NavbarMobile';
import MyAssets from './Project/FAMobile/MyAssets';
import { CssBaseline, Box } from '@mui/material';


const App: React.FC = () => {

  const [deviceType, setDeviceType] = React.useState<string>("mobile");
  const currentPath = window.location.pathname;

  // ดึงวันที่และเวลาจาก localStorage หรือใช้ undefined ถ้าไม่พบ //สร้างวันที่ปัจจุบัน //ฟังก์ชันในการเปรียบเทียบวันที่ // แปลงสตริงเป็นวัตถุ Date
  const date_login: string | null = localStorage.getItem('date_login');
  const now = new Date();
  const isMoreThanOneDayAgo = (dateStr: string | null): boolean => {
    if (!dateStr) {
      return false; // ถ้าไม่มีข้อมูลให้ถือว่าเป็น False
    }
    const loginDate = new Date(
      `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T${dateStr.substring(8, 10)}:${dateStr.substring(10, 12)}:${dateStr.substring(12, 14)}`
    );
    const difference = now.getTime() - loginDate.getTime();     // คำนวณความแตกต่างในมิลลิวินาที
    return difference > 24 * 60 * 60 * 1000;     // ตรวจสอบว่าความแตกต่างมากกว่า 1 วันหรือไม่ (24 ชั่วโมง * 60 นาที * 60 วินาที * 1000 มิลลิวินาที)
  };
  // ใช้ฟังก์ชันเพื่อเปรียบเทียบ
  const hasExpired = isMoreThanOneDayAgo(date_login);
  const token = localStorage.getItem('token');


  React.useEffect(() => {
    const deviceTypeFrsit = window.innerWidth < 1100 ? "mobile" : "desktop"
    const checkDevice = () => {
      if (token && !hasExpired && deviceTypeFrsit === 'mobile' && currentPath === '/') {
        window.location.href = '/MobileHome';
      }
      setDeviceType(deviceTypeFrsit);
    };

    checkDevice(); // เช็คขนาดตอนเริ่มต้น
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, [window.innerWidth, currentPath])


  if (!token || hasExpired) {
    return (
      <Login />
    )
  }
  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          width: '100%',
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        }}
      >
        {(token && !hasExpired && deviceType === 'desktop') ? <NavBar /> : <NavbarMobile />}
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/NAC_CREATE" element={<Crate />} />
          <Route path="/NAC_OPERATOR" element={<ListNacPage />} />
          <Route path="/NAC_ROW" element={<ListNacPage />} />
          <Route path="/EditPeriod" element={<ListPeriod />} />
          <Route path="/CreatePeriod" element={<CreatePeriod />} />
          <Route path="/FETCH_ASSETS" element={<MainAssets />} />
          <Route path="/EBookMain" element={<MainEbookAssets />} />
          <Route path="/Reported_Assets_Counted" element={<MainListCountedAssets />} />
          <Route path="/Report" element={<SelectBU />} />
          <Route path="/History_of_Assets" element={<HistoryList />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ControlSection" element={<ControlSection />} />
          <Route path="/EBookBranch" element={<MainEbookAssets />} />
          <Route path="/Account_BrnachAssets" element={<MainAssets />} />
          {/* Mobile */}
          <Route path="/MobileHome" element={<MobileHome />} />
          <Route path="/MyAssets" element={<MyAssets />} />
        </Routes>
      </Box>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
