import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Autocomplete, Button, CardHeader, Divider, List, ListItem, ListItemText, Stack, styled, Switch, TextField } from '@mui/material';
import { UserInfo, ResetPass, DataUser, Permission, MenuPermissionItem } from '../type/nacType';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { dataConfig } from '../config';
import SaveIcon from '@mui/icons-material/Save';
import FormControlLabel from '@mui/material/FormControlLabel';

const ValidationTextField = styled(TextField)(({ theme }) => ({
  width: '100%', // แทน fullWidth
  backgroundColor: 'rgb(248, 250, 252)', // แทน bgcolor
}));

export default function Profile() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [users, setUsers] = React.useState<DataUser[]>([]);
  const [menuActive, setMenuActive] = React.useState([]);
  const [menu, setMenu] = React.useState<MenuPermissionItem[]>([]);

  const fetuser = async () => {
    await Axios.get(dataConfig.http + '/User_List', dataConfig.headers)
      .then((res) => {
        setUsers(res.data)
      })

    await Axios.post(dataConfig.http + '/Permission_Menu_NAC', {}, dataConfig.headers)
      .then((res) => {
        setMenu(res.data.data)
      })
  }

  const OnSelectUser = async (value: string) => {
    await Axios.post(
      dataConfig.http + '/Select_Permission_Menu_NAC',
      { Permission_TypeID: 1, UserCode: value },
      dataConfig.headers
    ).then((res) => {
      if (res.status === 200) {
        setMenuActive((res.data.data).map((resData: { menuid: number; }) => resData.menuid))
      }
    })
  }

  React.useEffect(() => {
    fetuser()
  }, [])


  return (
    <Card
      variant='outlined'
      sx={{
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <CardHeader
        subheader={
          <Typography
            variant="subtitle1"
            sx={{
              minHeight: 15,
              maxHeight: 15,
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            Permission Users
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Grid
          container
          direction="column"
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid size={12}>
            <Autocomplete
              id="free-solo-2-demo"
              options={users.map((option) => option.UserCode)}
              onChange={(event, value) => OnSelectUser(value || '')}
              renderInput={(params) => (
                <ValidationTextField
                  {...params}
                  required
                  name="empUpper"
                  label="Em Upper"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 3 }}>
              <ListItemText primary="Menu" primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
              {menu.filter((res) => res.menutypeid === 2).map((res) => (
                <React.Fragment key={res.menuid}>
                  <ListItem disablePadding>
                    <FormControlLabel
                      control={<Switch />}
                      label={`${res.menu_name} ${res.menuid}`}
                      checked={(menuActive.findIndex((resActive) => resActive === res.menuid) < 0) ? false : true}
                    />
                  </ListItem>
                  {/* <Divider component="li" /> */}
                </React.Fragment>
              ))}
            </List>
            <Divider />
            <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 3 }}>
              <ListItemText primary="Document" primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
              {menu.filter((res) => res.menutypeid === 1).map((res) => (
                <React.Fragment key={res.menuid}>
                  <ListItem disablePadding>
                    <FormControlLabel
                      control={<Switch />}
                      label={res.menu_name}
                      checked={(menuActive.findIndex((resActive) => resActive === res.menuid) < 0) ? false : true}
                    />
                  </ListItem>
                  {/* <Divider component="li" /> */}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}