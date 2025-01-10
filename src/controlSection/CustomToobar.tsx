import { GridToolbarContainer } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { DataUser } from '../type/nacType';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

interface DataTable {
  rows: DataUser[];
}

export default function CustomToolbar({ rows }: Readonly<DataTable>) {

  return (
    <Box component="main">
      <GridToolbarContainer >
        <Box sx={{ flexGrow: 1 }} />
      </GridToolbarContainer>
      <Divider />
    </Box>
  );
}