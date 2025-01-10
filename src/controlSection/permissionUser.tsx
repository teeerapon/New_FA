import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, CardHeader, Divider, styled, TextField } from '@mui/material';
import { UserInfo, ResetPass } from '../type/nacType';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { dataConfig } from '../config';
import SaveIcon from '@mui/icons-material/Save';

const ValidationTextField = styled(TextField)(({ theme }) => ({
  width: '100%', // แทน fullWidth
  backgroundColor: 'rgb(248, 250, 252)', // แทน bgcolor
}));

export default function Profile() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [userInfo, setUserInfo] = React.useState<UserInfo[]>([])
  const [resetPass, setResetPass] = React.useState<ResetPass[]>([{
    current_password: '',
    new_password: '',
    confirm_password: '',
  }])


  return (
    <Card variant='outlined'>
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
            Change Password
          </Typography>
        }
      />
      <Divider sx={{ my: 1 }} />
      <CardContent>
        <Grid
          container
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Grid size={6}>
            <ValidationTextField
              label="Current Password"
              size="small"
              value={resetPass[0].current_password || ''}
              fullWidth
              onChange={(e) => {
                const list = [...resetPass]
                list[0].current_password = e.target.value
                setResetPass(list)
              }}
            />
          </Grid>
          <Grid size={6} />
          <Grid size={6}>
            <ValidationTextField
              label="New Password"
              value={resetPass[0].new_password || ''}
              size="small"
              fullWidth
              onChange={(e) => {
                const list = [...resetPass]
                list[0].new_password = e.target.value
                setResetPass(list)
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Confirm Password"
              size="small"
              value={resetPass[0].confirm_password || ''}
              sx={{ bgcolor: 'rgb(248, 250, 252)' }}
              onChange={(e) => {
                const list = [...resetPass]
                list[0].confirm_password = e.target.value
                setResetPass(list)
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}