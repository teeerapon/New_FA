import { GridActionsCellItem, GridCellParams, GridColDef, GridRowParams } from "@mui/x-data-grid"
import DataTable from "./DataTable"
import React from "react";
import { NACDetailHistory, ListNACHeaders } from '../../../type/nacType';
import { Typography, AppBar, Container, Toolbar, Autocomplete, TextField, Card, CssBaseline } from "@mui/material";
import { dataConfig } from "../../../config";
import Axios from 'axios';
import { Outlet, useNavigate } from "react-router";
import ArticleIcon from '@mui/icons-material/Article';
import Grid from '@mui/material/Grid2';

export default function ListNacPage() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [rows, setRows] = React.useState<NACDetailHistory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // State สำหรับการกรองแต่ละฟิลด์
  const [originalRows, setOriginalRows] = React.useState<NACDetailHistory[]>([]);
  const [filterRows, setFilterRows] = React.useState<Partial<NACDetailHistory>>({
    nac_code: undefined,
    nacdtl_assetsCode: undefined,
    nacdtl_assetsName: undefined,
    update_date: undefined,
    source_approve_userid: undefined,
    account_approve_id: undefined,
  });
    const navigate = useNavigate();

  const searchFilterByKey = (newValue: String | null | undefined, key: keyof NACDetailHistory, reason: any) => {
    const listFilter = {
      ...filterRows, [key]: ['', null, undefined].includes(newValue as string | null | undefined) ?
        undefined : newValue,
    }
    const original = originalRows;
    const filteredRows = original.filter(row => {
      return Object.keys(filterRows).every(key => {
        const fieldKey = key as keyof NACDetailHistory;
        return listFilter[fieldKey] === undefined || listFilter[fieldKey] === row[fieldKey];
      });
    });
    setFilterRows(listFilter);
    setRows(filteredRows);
  };

  const columns: GridColDef[] = [
    { field: 'nacdtl_assetsCode', headerName: 'รหัสทรัพย์สิน', width: 140, headerAlign: 'center', align: 'center', },
    { field: 'nacdtl_assetsName', headerName: 'ชื่อทรัพย์สิน', width: 250, headerAlign: 'center', flex: 1, },
    {
      field: 'nacdtl_assetsPrice', headerName: 'ราคาทุน', headerAlign: 'center', align: 'right', width: 160,
      renderCell: (params) => params.row.nacdtl_assetsPrice ? params.row.nacdtl_assetsPrice.toLocaleString('en-US') : 0,
    },
    { field: 'nac_code', headerName: 'เลขที่ NAC', width: 100, headerAlign: 'center', align: 'center', },
    { field: 'name', headerName: 'หัวข้อรายการ', width: 140, headerAlign: 'center', align: 'center', },
    { field: 'create_by', headerName: 'ผู้ทำรายการ', headerAlign: 'center', align: 'center', width: 140, },
    { field: 'source_approve_userid', headerName: 'ผู้อนุมัติ', headerAlign: 'center', align: 'center', width: 100, },
    { field: 'account_aprrove_id', headerName: 'ผู้ปิดรายการ', headerAlign: 'center', width: 100, },
    { field: 'update_date', headerName: 'วันที่ปิดรายการ', headerAlign: 'center', align: 'center', flex: 1, },
    {
      field: 'Actions', type: 'actions', headerAlign: 'center', align: 'center', width: 100,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<ArticleIcon />}
            label="Edit Row"
            onClick={() => handleEditClick(params)} // Pass params to the function
            color="warning"
          />,
        ];
      },
    },
  ];

  const handleEditClick = (params: GridRowParams<ListNACHeaders>) => {
    const newPageValue = localStorage.getItem('pagination') || 1; // Example for getting page value
    localStorage.setItem('pagination_user', newPageValue.toString());
    localStorage.removeItem("pagination");

    localStorage.setItem('NacCode', JSON.stringify({
      nac_code: params.row.nac_code,
      nac_status: params.row.nac_status
    }));
    navigate(`/NAC_CREATE?id=${params.row.workflowtypeid}?nac_code=${params.row.nac_code}`);
  };

  React.useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        await Axios.post(`${dataConfig.http}/store_FA_control_HistorysAssets`, { userCode: parsedData.UserCode }, dataConfig.headers)
          .then((res) => {
            if (res.status === 200) {
              setLoading(false)
              setRows(res.data.data);
              setOriginalRows(res.data.data);
            } else {
              setLoading(false)
              setRows([]);
              setOriginalRows([]);
            }
          }).finally(() => setLoading(false));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [parsedData.UserCode, parsedData.userid]);

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
            ประวัติการทำ NAC ทั้งหมด
          </Typography>
        </Toolbar>
      </AppBar>
      <CssBaseline enableColorScheme />
      <Container component="main" sx={{ my: 2 }} maxWidth="xl">
        <Grid container spacing={2} sx={{ py: 1 }}>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.nac_code || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'nac_code', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.nac_code).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="nac_code" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.nacdtl_assetsCode || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'nacdtl_assetsCode', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.nacdtl_assetsCode).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Code" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.name || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'name', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.name).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="หัวข้อรายการ" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.account_approve_id || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'account_approve_id', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.account_approve_id).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="ผู้อนุมัติ" />}
            />
          </Grid>
        </Grid>
        <Card variant="outlined">
          <DataTable
            rows={rows}
            columns={columns}
            loading={loading}
            isCellEditable={function (params: GridCellParams): boolean {
              throw new Error("Function not implemented.");
            }}
          />
        </Card>
        <Outlet />
      </Container>
    </React.Fragment >
  );
}