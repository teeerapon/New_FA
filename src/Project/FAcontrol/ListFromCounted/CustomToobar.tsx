import { GridToolbarContainer } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Alert, Button, Stack } from '@mui/material';
import { CountAssetRow } from '../../../type/nacType';
import { exportToExcel } from './ExportRow';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

interface DataTable {
  rows: CountAssetRow[];
}

export default function CustomToolbar({ rows }: Readonly<DataTable>) {
  console.log(rows);
  

  return (
    <Box component="main">
      <GridToolbarContainer >
        <Box sx={{ flexGrow: 1, p: 1 }}>
          <Stack direction="row" spacing={1}>
            <Alert severity="success">ตรวจนับแล้ว ({rows.filter(res => res.Reference).length})</Alert>
            <Alert severity="error">ยังไม่ได้ตรวจนับ ({rows.filter(res => !res.Reference).length})</Alert>
          </Stack>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {rows && (
          <Button size="small" color="primary" startIcon={<SystemUpdateAltIcon />}
            onClick={() => exportToExcel(rows)}
          >
            Export
          </Button>
        )}
      </GridToolbarContainer>
      <Divider />
    </Box>
  );
}