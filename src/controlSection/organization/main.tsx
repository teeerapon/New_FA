import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Divider, Stack, Typography } from '@mui/material';
import { DataUser, EmployeeNode, HierarchyData } from '../../type/nacType';
import Axios from 'axios';
import { dataConfig } from '../../config';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

export default function Profile() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;


  const [treeData, setTreeData] = React.useState<EmployeeNode[]>([]);
  const [users, setUsers] = React.useState<DataUser[]>([]);

  const transformData = (data: any[], funcFun: HierarchyData[]) => {
    const mdMap = new Map<string, EmployeeNode>();
    const fmMap = new Map<string, EmployeeNode>();
    const dmMap = new Map<string, EmployeeNode>();
    const smMap = new Map<string, EmployeeNode>();

    data.forEach(({ MD, FM, DM, SM, ST }: any) => {
      if (!mdMap.has(MD)) {
        mdMap.set(MD, {
          id: MD,
          funcCode: null,
          funcName: null,
          depCode: null,
          depName: null,
          secCode: null,
          secName: null,
          code:
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              กรรมการผู้จัดการ [MD]
            </Typography>
          ,
          label: `${MD} กรรมการผู้จัดการ [MD]`,
          position: `MD`,
          children: []
        });
      }
      const mdNode = mdMap.get(MD)!;

      if (FM && !fmMap.has(FM)) {
        const fmNode = {
          id: `${MD}_${FM}`,
          funcCode: funcFun.find((res) => res.OwnerCode === FM)?.FuncCode ?? null,
          funcName: funcFun.find((res) => res.OwnerCode === FM)?.FuncName ?? null,
          depCode: null,
          depName: null,
          secCode: null,
          secName: null,
          label: `
          ${FM} [FM]
          ${funcFun.find((res) => res.OwnerCode === FM)?.FuncName} [${funcFun.find((res) => res.OwnerCode === FM)?.FuncCode}]
          `,
          position: `FM`,
          children: []
        };
        fmMap.set(FM, fmNode);
        mdNode.children?.push(fmNode);
      }
      const fmNode = fmMap.get(FM)!;

      if (DM && !dmMap.has(DM)) {
        const dmNode = {
          id: `${FM}_${DM}`,
          funcCode: funcFun.find((res) => res.OwnerCode === DM)?.FuncCode ?? null,
          funcName: funcFun.find((res) => res.OwnerCode === DM)?.FuncName ?? null,
          depCode: funcFun.find((res) => res.OwnerCode === DM)?.DepCode ?? null,
          depName: funcFun.find((res) => res.OwnerCode === DM)?.name ?? null,
          secCode: null,
          secName: null,
          label: `
          ${DM} [DM]
          ${funcFun.find((res) => res.OwnerCode === DM)?.name} [${funcFun.find((res) => res.OwnerCode === DM)?.DepCode}]
          `,
          position: `DM`,
          children: []
        };
        dmMap.set(DM, dmNode);
        fmNode.children?.push(dmNode);
      }
      const dmNode = dmMap.get(DM)!;

      if (SM && !smMap.has(SM)) {
        const smNode = {
          id: `${DM}_${SM}`,
          funcCode: funcFun.find((res) => res.OwnerCode === SM)?.FuncCode ?? null,
          funcName: funcFun.find((res) => res.OwnerCode === SM)?.FuncName ?? null,
          depCode: funcFun.find((res) => res.OwnerCode === SM)?.DepCode ?? null,
          depName: funcFun.find((res) => res.OwnerCode === SM)?.name ?? null,
          secCode: funcFun.find((res) => res.OwnerCode === SM)?.SecCode ?? null,
          secName: funcFun.find((res) => res.OwnerCode === SM)?.SecName ?? null,
          label: `
          ${SM} [SM]
          ${funcFun.find((res) => res.OwnerCode === SM)?.SecName} [${funcFun.find((res) => res.OwnerCode === SM)?.SecCode}]
          `,
          position: `SM`,
          children: []
        };
        smMap.set(SM, smNode);
        dmNode.children?.push(smNode);
      }
      const smNode = smMap.get(SM)!;

      if (ST) {
        smNode.children?.push({
          funcCode: funcFun.find((res) => res.OwnerCode === ST)?.FuncCode ?? null,
          funcName: funcFun.find((res) => res.OwnerCode === ST)?.FuncName ?? null,
          depCode: funcFun.find((res) => res.OwnerCode === ST)?.DepCode ?? null,
          depName: funcFun.find((res) => res.OwnerCode === ST)?.name ?? null,
          secCode: funcFun.find((res) => res.OwnerCode === ST)?.SecCode ?? null,
          secName: funcFun.find((res) => res.OwnerCode === ST)?.SecName ?? null,
          id: `${SM}_${ST}`,
          label: `${ST} [${funcFun.find(res => res.OwnerCode === ST)?.PositionCode}]`,
          position: `ST`,
        });
      }
    });
    return Array.from(mdMap.values());
  };



  const fetData = async () => {

    // แสดง users ทั้งหมด
    await Axios.get(dataConfig.http + '/User_List', dataConfig.headers)
      .then((res) => {
        setUsers(res.data)
      })

    // Fetch department list
    const respobse_department = await Axios.get(`${dataConfig.http}/Organization_List`, dataConfig.headers)
    if (respobse_department.data) {
      const newArray = respobse_department.data
      const respobse_Position = await Axios.get(`${dataConfig.http}/User_List_ByPosition`, dataConfig.headers)
      if (respobse_Position.data) {
        const transformedData = transformData(respobse_Position.data, newArray);
        setTreeData(transformedData);
      }
    }

  }

  React.useEffect(() => {
    fetData();
  }, [])

  // const renderTree = (nodes: EmployeeNode) => (
  //   <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
  //     {Array.isArray(nodes.children) && nodes.children.length > 0
  //       ? nodes.children.map((child) => renderTree(child))
  //       : null}
  //   </TreeItem>
  // );

  return (
    <React.Fragment>
      <Card
        variant='outlined'
        sx={{
          width: '100vw',
          maxWidth: '100vw', // จำกัดความกว้างให้พอดีกับหน้าจอ
        }}
      >
        <CardHeader
          subheader={
            <React.Fragment>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: '15px',
                  maxHeight: '15px'
                }}
              >
              </Stack>
            </React.Fragment>
          }
        />
        <Divider />
        <CardContent sx={{ width: '100%' }}>
          <RichTreeView
            defaultExpandedItems={['grid']}
            slots={{ item: CustomTreeItem }}
            items={treeData}
          />
        </CardContent>
      </Card>
    </React.Fragment >
  );
}