import { Stack, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // ให้ครอบคลุมทั้งหน้าจอ
      }}
    >
        <Stack sx={{ justifyContent: "center", alignItems: "center", }}>
          <CircularProgress color="inherit" />
        </Stack>
    </Box>
  );
}