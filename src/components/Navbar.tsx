import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from "react-router";
import { Avatar, Button, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeViewMenu from './TreeViewMenu';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { UserInfo } from '../type/nacType';
import Axios from 'axios';
import { dataConfig } from '../config';
import Login from '../login';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function MenuAppBar() {
  const theme = useTheme();
  const [openTree, setOpenTree] = React.useState(false);

  const navigate = useNavigate();
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [userData, setUserData] = React.useState<UserInfo>();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [permission_menuID, setPermission_menuID] = React.useState<number[]>([]);

  React.useEffect(() => {
    const fetData = async () => {
      // POST request using axios with set header

      const body = { Permission_TypeID: 1, userID: parsedData.userid }
      const headers = {
        'Authorization': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      };
      await Axios.post(dataConfig.http + '/select_Permission_Menu_NAC', body, { headers })
        .then(response => {
          setPermission_menuID(response.data.data.map((res: { Permission_MenuID: number; }) => res.Permission_MenuID))
        });
    }
    fetData();
  }, []);

  const toggleDrawerTree = (newOpen: boolean) => () => {
    setOpenTree(newOpen);
  };

  const DrawerList = (
    <Box sx={{ minWidth: 300 }}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawerTree(false)}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <TreeViewMenu />
    </Box>
  );

  const handleLogOut = () => {
    localStorage.clear();
    setAuth(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const storedData = localStorage.getItem('data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);


  if (!auth) {
    return <Login />
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static">
            <Drawer
              sx={{
                minWidth: 300,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  minWidth: 300,
                  boxSizing: 'border-box',
                },
              }}
              open={openTree} onClose={toggleDrawerTree(false)}>
              {DrawerList}
            </Drawer>
            <Toolbar>
              <Stack direction="row" component="div" sx={{ flexGrow: 1 }}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawerTree(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Button onClick={() => navigate("/")} variant='text'>
                  <Typography
                    style={{ color: '#ea0c80' }}
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3em',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <b>DATA</b>
                  </Typography>
                  <Typography
                    style={{ color: '#07519e' }}
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3em',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <b>CENTER</b>
                  </Typography>
                </Button>
              </Stack>
              <Stack direction="row" component="div" spacing={2} sx={{ justifyContent: "center", alignItems: "center", }}>
                <Typography variant="body1">
                  <b>{userData?.name}</b>
                </Typography>
                {auth && (
                  <div>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <Avatar
                        alt={userData && userData.UserCode || ''}
                        src={userData && userData.img_profile || ''}
                        sx={{ width: 35, height: 35 }}
                      />
                    </IconButton>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem disabled={userData?.depcode !== '101ITO'} onClick={() => navigate(`/Profile`)}>
                        <ListItemIcon sx={{ minWidth: '15% !important' }}>
                          <ManageAccountsOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText>&nbsp; &nbsp;User Profile</ListItemText>
                      </MenuItem>
                      {permission_menuID.includes(20) && (
                        <MenuItem onClick={() => navigate(`/ControlSection`)}>
                          <ListItemIcon sx={{ minWidth: '15% !important' }}>
                            <AdminPanelSettingsOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText>&nbsp; &nbsp;Control section</ListItemText>
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogOut}>
                        <ListItemIcon sx={{ minWidth: '15% !important' }}>
                          <LogoutOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText>&nbsp; &nbsp;Log Out</ListItemText>
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </Stack>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    );
  }
}
