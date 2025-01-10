import { GridToolbarContainer } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { NACDetailHistory } from '../../../type/nacType';
import { exportToExcel } from './ExportRow';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

interface DataTable {
  rows: NACDetailHistory[];
}

export default function CustomToolbar({ rows }: Readonly<DataTable>) {

  return (
    <Box component="main">
      <GridToolbarContainer >
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