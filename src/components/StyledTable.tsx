
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled, alpha } from '@mui/material/styles';


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.common.white}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: `1px solid ${alpha(theme.palette.common.black, 0.5)}`,
  },
}));

export const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  border: `1px solid ${alpha(theme.palette.common.black, 0.7)}`,
}));