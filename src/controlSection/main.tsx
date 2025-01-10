import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Alert, alpha, AppBar, Avatar, Button, CardActions, CardHeader, Container, Divider, InputBase, List, ListItem, ListItemAvatar, ListItemText, Stack, styled, TextField, Toolbar } from '@mui/material';
import { UserInfo, ResetPass } from '../type/nacType';
import Axios from 'axios';
import Swal from 'sweetalert2';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { dataConfig } from '../config';
import SaveIcon from '@mui/icons-material/Save';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import ControlUsers from './users';
import PermissionUsers from './permissionUser'
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';

const ValidationTextField = styled(TextField)(({ theme }) => ({
  width: '100%', // แทน fullWidth
  backgroundColor: 'rgb(248, 250, 252)', // แทน bgcolor
}));

const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url); // จะ throw error หาก URL ไม่ถูกต้อง
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'; // ตรวจสอบว่าเป็น http หรือ https
  } catch (error) {
    return false; // ไม่ใช่ URL ที่ถูกต้อง
  }
};

const isValidData = (data: ResetPass[]): boolean => {
  const allFieldsFilled = data.every(
    (item) =>
      (item.current_password || '').trim() !== '' &&
      (item.new_password || '').trim() !== '' &&
      (item.confirm_password || '').trim() !== ''
  );

  return allFieldsFilled;
};

interface LoginCredentials {
  UserCode: string;
  Password: string;
}

interface LoginResponse {
  token?: string;
  data: Array<{ userid: string }>;
}

async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(dataConfig.http + '/login', {
    method: 'POST',
    headers: dataConfig.headers,
    body: JSON.stringify(credentials)
  });
  return response.json();
}

export default function Profile() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [userInfo, setUserInfo] = React.useState<UserInfo[]>([])
  const [resetPass, setResetPass] = React.useState<ResetPass[]>([{
    current_password: '',
    new_password: '',
    confirm_password: '',
  }])
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const allowedImageExtensions = ['jpg', 'png', 'gif', 'jpeg'];
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedImageExtensions.includes(fileExtension)) {
        const formData_1 = new FormData();
        formData_1.append("file", file);
        formData_1.append("fileName", file.name);

        try {
          const response = await Axios.post(
            `http://vpnptec.dyndns.org:32001/api/check_files_NewNAC`,
            formData_1,
            dataConfig.headerUploadFile
          );

          if (response.status === 200) {
            const list = [...userInfo];
            list[0].img_profile = `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`;
            setUserInfo(list);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        console.warn("Invalid file type.");
      }
    }
  };

  const SavedChangeUserInfo = async () => {
    if (!isValidUrl(userInfo && userInfo[0]?.img_profile || parsedData.img_profile)) {
      Swal.fire({
        icon: "error",
        title: `Valid URL: ${userInfo && userInfo[0]?.img_profile || parsedData.img_profile}`,
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      try {
        const res = await Axios.post(
          dataConfig.http + '/User_UpdateUserInfo', userInfo && userInfo[0] || parsedData,
          dataConfig.headers
        );
        if (res.status === 200) {
          localStorage.setItem('data', JSON.stringify(res.data[0]));
          setUserInfo(res.data)
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  const ChangePass = async () => {
    const response = await loginUser({
      UserCode: parsedData.UserCode,
      Password: resetPass[0].current_password || '',
    });
    if ('token' in response) {
      const resChangePass = await Axios.post(
        dataConfig.http + '/User_ResetPassword',
        { loginname: parsedData.UserCode, newpassword: resetPass[0].new_password || '' },
        dataConfig.headers
      );
      if (resChangePass.status === 200) {
        setResetPass([{
          current_password: '',
          new_password: '',
          confirm_password: '',
        }])
        Swal.fire({
          icon: "success",
          title: `เปลี่ยนรหัสผ่านสำเร็จ`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: `รหัสผ่านปัจจุบันผิด กรุณาลองใหม่อีกครั้ง`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  React.useEffect(() => {
    if (parsedData) {
      setUserInfo([parsedData])
    }
  }, [])


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
            Control Section
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          minHeight: '45vh',
          mb: 2
        }}
      >
        <Container component="main" sx={{ my: 2, }} maxWidth="xl">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card
              variant='outlined'
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                width: '100%',
                justifyContent: 'space-between',
                alignItems: { xs: 'start', md: 'center' },
                gap: 2,
                overflow: 'auto',
                p: 2
              }}
            >
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                ส่วนสำหรับควบคุมระบบ (Operation)
              </Typography>
            </Card>
            <Card
              variant='outlined'
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                width: '100%',
                justifyContent: 'space-between',
                alignItems: { xs: 'start', md: 'center' },
                gap: 2,
                overflow: 'auto',
                p: 2
              }}
            >
              <Grid
                container
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                spacing={3}
              >
                <Grid size={12}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    role="navigation"
                    sx={{
                      height: '40px',
                      minHeight: '40px',
                    }}
                  >
                    <Tab
                      icon={<PersonPinOutlinedIcon />}
                      iconPosition="start"
                      label="List Users"
                      sx={{
                        height: '40px',
                        minHeight: '40px',
                        textTransform: 'none',
                        fontFamily: 'cursiveRoboto, sans-serif',
                        fontWeight: 500
                      }}
                    />
                    <Tab
                      icon={<LockPersonOutlinedIcon />}
                      iconPosition="start"
                      label="Permission"
                      sx={{
                        height: '40px',
                        minHeight: '40px',
                        textTransform: 'none',
                        fontFamily: 'cursiveRoboto, sans-serif',
                        fontWeight: 500
                      }}
                    />
                  </Tabs>
                  <Divider />
                </Grid>
                {value === 0 ? (
                  <ControlUsers />
                ) : (
                  <PermissionUsers />
                )}
              </Grid>
            </Card>
          </Box>
        </Container>
      </Box>
    </React.Fragment>
  );
}