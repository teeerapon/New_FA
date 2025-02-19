// import * as React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import { alpha, Autocomplete, Badge, BadgeProps, Box, Button, CardActionArea, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Check from '@mui/icons-material/Check';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import { StepIconProps } from '@mui/material/StepIcon';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import Grid from '@mui/material/Grid2';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import BuildIcon from '@mui/icons-material/Build';
// import { DataUser, Department, EmployeeNode, HierarchyData } from '../../type/nacType';
// import Axios from 'axios';
// import { dataConfig } from '../../config';
// import WorkIcon from '@mui/icons-material/Work';
// import { styled } from '@mui/material/styles';

// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 22,
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     width: '100%',
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//     ...theme.applyStyles('dark', {
//       backgroundColor: theme.palette.grey[800],
//     }),
//   },
// }));

// const ColorlibStepIconRoot = styled('div')<{
//   ownerState: { completed?: boolean; active?: boolean };
// }>(({ theme }) => ({
//   backgroundColor: '#ccc',
//   zIndex: 1,
//   color: '#fff',
//   width: 40,
//   height: 40,
//   display: 'flex',
//   borderRadius: '50%',
//   justifyContent: 'center',
//   alignItems: 'center',
//   ...theme.applyStyles('dark', {
//     backgroundColor: theme.palette.grey[700],
//   }),
//   variants: [
//     {
//       props: ({ ownerState }) => ownerState.active,
//       style: {
//         backgroundImage:
//           'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
//         boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//       },
//     },
//     {
//       props: ({ ownerState }) => ownerState.completed,
//       style: {
//         backgroundImage:
//           'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
//       },
//     },
//   ],
// }));

// function ColorlibStepIcon(props: StepIconProps) {
//   const { active, completed, className } = props;

//   const icons: { [index: string]: React.ReactElement<unknown> } = {
//     1: <ApartmentIcon />,
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
//       {icons[String(props.icon)]}
//     </ColorlibStepIconRoot>
//   );
// }

// function ColorlibStepIconII(props: StepIconProps) {
//   const { active, completed, className } = props;

//   const icons: { [index: string]: React.ReactElement<unknown> } = {
//     1: <CurrencyExchangeIcon />,
//     2: <WorkIcon />,
//     3: <ManageAccountsIcon />,
//     4: <StorefrontIcon />,
//     5: <BuildIcon />,
//     6: <AddShoppingCartIcon />,
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
//       {icons[String(props.icon)]}
//     </ColorlibStepIconRoot>
//   );
// }

// export default function Profile() {
//   const data = localStorage.getItem('data');
//   const parsedData = data ? JSON.parse(data) : null;


//   const [treeData, setTreeData] = React.useState<EmployeeNode[]>([]);
//   const [state, setState] = React.useState<{
//     depcode: string | null;
//     number: number;
//   }>({ depcode: null, number: 0 });
//   const [depList, setDepList] = React.useState<HierarchyData[]>([]);
//   const [hierarchyData, setHierarchyData] = React.useState<HierarchyData[]>([]);
//   const [users, setUsers] = React.useState<DataUser[]>([]);
//   const [openDialog, setOpenDialog] = React.useState<boolean>(false);
//   const [newewPostionUser, SetNewPostionUser] = React.useState<string | null>('');
//   const [dialogChange, setDialogChange] = React.useState<{
//     usercode: string | null;
//     depcode: string;
//     seccode: string;
//     funccode: string | null;
//     position: string | null;
//     rowCurrent: string;
//   }>({
//     usercode: '',
//     depcode: '',
//     seccode: '',
//     funccode: '',
//     position: '',
//     rowCurrent: '',
//   });

//   const transformData = (data: any[], funcFun: HierarchyData[]) => {
//     const mdMap = new Map<string, EmployeeNode>();
//     const fmMap = new Map<string, EmployeeNode>();
//     const dmMap = new Map<string, EmployeeNode>();
//     const smMap = new Map<string, EmployeeNode>();

//     data.forEach(({ MD, FM, DM, SM, ST }: any) => {
//       if (!mdMap.has(MD)) {
//         mdMap.set(MD, {
//           id: MD,
//           funcCode: null,
//           depcode: null,
//           code: <Typography variant="caption">
//             กรรมการผู้จัดการ <br />
//             [MD]
//           </Typography>,
//           name: MD + ' [MD]',
//           children: []
//         });
//       }
//       const mdNode = mdMap.get(MD)!;

//       if (FM && !fmMap.has(FM)) {
//         const fmNode = {
//           id: `${MD}_${FM}`,
//           funcCode: funcFun.find((res) => res.OwnerCode === FM)?.FuncCode ?? null,
//           depcode: null,
//           code: <Typography variant="caption">
//             {funcFun.find((res) => res.OwnerCode === FM)?.FuncName} <br />
//             [{funcFun.find((res) => res.OwnerCode === FM)?.FuncCode}]
//           </Typography>,
//           name: `${FM} [FM]`,
//           children: []
//         };
//         fmMap.set(FM, fmNode);
//         mdNode.children?.push(fmNode);
//       }
//       const fmNode = fmMap.get(FM)!;

//       if (DM && !dmMap.has(DM)) {
//         const dmNode = {
//           id: `${FM}_${DM}`,
//           funcCode: funcFun.find((res) => res.OwnerCode === DM)?.FuncCode ?? null,
//           depcode: funcFun.find((res) => res.OwnerCode === DM)?.DepCode ?? null,
//           code: <Typography variant="caption">
//             {funcFun.find((res) => res.OwnerCode === DM)?.name} <br />
//             [{funcFun.find((res) => res.OwnerCode === DM)?.DepCode}]
//           </Typography>,
//           name: `${DM} [DM]`,
//           children: []
//         };
//         dmMap.set(DM, dmNode);
//         fmNode.children?.push(dmNode);
//       }
//       const dmNode = dmMap.get(DM)!;

//       if (SM && !smMap.has(SM)) {
//         const smNode = {
//           id: `${DM}_${SM}`,
//           funcCode: funcFun.find((res) => res.OwnerCode === SM)?.FuncCode ?? null,
//           depcode: funcFun.find((res) => res.OwnerCode === SM)?.DepCode ?? null,
//           code: <Typography variant="caption">
//             {funcFun.find((res) => res.OwnerCode === SM)?.SecCode} <br />
//             [{funcFun.find((res) => res.OwnerCode === SM)?.SecName}]
//           </Typography>,
//           name: SM + ' [SM]',
//           children: []
//         };
//         smMap.set(SM, smNode);
//         dmNode.children?.push(smNode);
//       }
//       const smNode = smMap.get(SM)!;

//       if (ST) {
//         smNode.children?.push({
//           funcCode: funcFun.find((res) => res.OwnerCode === ST)?.FuncCode ?? null,
//           depcode: funcFun.find((res) => res.OwnerCode === ST)?.DepCode ?? null,
//           id: `${SM}_${ST}`,
//           name: ST
//         });
//       }
//     });
//     return Array.from(mdMap.values());
//   };

//   const fetData = async () => {

//     // แสดง users ทั้งหมด
//     await Axios.get(dataConfig.http + '/User_List', dataConfig.headers)
//       .then((res) => {
//         setUsers(res.data)
//       })

//     // Fetch department list
//     const respobse_department = await Axios.get(`${dataConfig.http}/Organization_List`, dataConfig.headers)
//     if (respobse_department.data) {
//       const newArray = respobse_department.data
//       const uniqueDataFuc: HierarchyData[] = Array.from(
//         new Map(
//           (newArray as HierarchyData[]).filter(res => res.Level === 2 && res.FuncCode).map((item) => [item.FuncCode, item])
//         ).values()
//       );
//       const uniqueDataDep: HierarchyData[] = Array.from(
//         new Map(
//           (newArray as HierarchyData[]).filter(res => res.Level === 3 && res.DepCode).map((item) => [item.DepCode, item])
//         ).values()
//       );
//       setHierarchyData(newArray);
//       setDepList(uniqueDataDep)
//       // Fetch User Position list
//       const respobse_Position = await Axios.get(`${dataConfig.http}/User_List_ByPosition`, dataConfig.headers)
//       if (respobse_Position.data) {
//         const transformedData = transformData(respobse_Position.data, newArray);
//         setTreeData(transformedData);
//       }
//     }

//   }

//   React.useEffect(() => {
//     fetData();
//   }, [])

//   return (
//     <React.Fragment>
//       <Card
//         variant='outlined'
//         sx={{
//           width: '100vw',
//           maxWidth: '100vw', // จำกัดความกว้างให้พอดีกับหน้าจอ
//         }}
//       >
//         <CardHeader
//           subheader={
//             <React.Fragment>
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 sx={{
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   minHeight: '15px',
//                   maxHeight: '15px'
//                 }}
//               >
//               </Stack>
//             </React.Fragment>
//           }
//         />
//         <Divider />
//         <CardContent sx={{ width: '100%' }}>
//           {state.number === 0 && (
//             <Grid
//               container
//               direction="row"
//               sx={{
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//               rowSpacing={2}
//               columnSpacing={3}
//             >
//               {treeData.map((treeMap, Treeindex) => (
//                 <Grid size={12} key={Treeindex}>
//                   <Stepper
//                     alternativeLabel
//                     connector={<ColorlibConnector />}
//                   >
//                     <Step
//                       completed={true}
//                       sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//                     >
//                       <StepLabel StepIconComponent={ColorlibStepIcon}>
//                         <Card variant="outlined" sx={{ textAlign: "center", width: 200 }}>
//                           <Box sx={{ bgcolor: '#EDF7F6' }}>
//                             <Typography sx={{ fontSize: 12, py: 1 }}>
//                               {treeMap.code}
//                             </Typography>
//                           </Box>
//                           <Box >
//                             <Typography sx={{ fontSize: 12, py: 1 }}>
//                               {treeMap.name}
//                             </Typography>
//                           </Box>
//                         </Card>
//                       </StepLabel>
//                     </Step>
//                   </Stepper>
//                   <Stepper
//                     alternativeLabel
//                     connector={<ColorlibConnector />}
//                   >
//                     {treeMap.children?.map((childrenMap, childrenIndex) => (
//                       <Step
//                         completed={true}
//                         sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//                         key={childrenIndex}
//                       >
//                         <StepLabel StepIconComponent={ColorlibStepIconII}>
//                           <Card variant="outlined" sx={{ textAlign: "center", width: 200 }}>
//                             <Box sx={{ bgcolor: '#AEC3B0' }}>
//                               <Typography sx={{ fontSize: 12, py: 1 }}>
//                                 {childrenMap.code}
//                               </Typography>
//                             </Box>
//                             <Box>
//                               <Typography sx={{ fontSize: 12, py: 1 }}>
//                                 {childrenMap.name}
//                               </Typography>
//                             </Box>
//                           </Card>
//                         </StepLabel>
//                         <Stack spacing={1} sx={{ p: 1 }} >
//                           {childrenMap.children?.map((ccMap, ccIndex) => (
//                             <Card
//                               variant="outlined"
//                               sx={{
//                                 textAlign: "center",
//                                 width: 200,
//                               }}
//                               key={ccIndex}
//                               onClick={() => {
//                                 setState({
//                                   depcode: ccMap.depcode,
//                                   number: 1,
//                                 })
//                               }}
//                             >
//                               <CardActionArea>
//                                 <Box
//                                   sx={{
//                                     bgcolor: '#DDA3B2',
//                                     "&:hover": {
//                                       bgcolor: alpha('#DDA3B2', 0.9),
//                                       color: "white",
//                                     },
//                                   }}>
//                                   <Typography sx={{ fontSize: 12, py: 1 }}>
//                                     {ccMap.code}
//                                   </Typography>
//                                 </Box>
//                               </CardActionArea>
//                             </Card>
//                           ))}
//                         </Stack>
//                       </Step>
//                     ))}
//                   </Stepper>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//           {state.number === 1 && (
//             <Grid
//               container
//               direction="row"
//               sx={{
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//               rowSpacing={2}
//               columnSpacing={3}
//             >
//               {depList.filter((depListFil) => depListFil.DepCode === state.depcode)
//                 .map((depMap, depindex) => (
//                   <Grid size={12} key={depindex}>
//                     <Stepper
//                       alternativeLabel
//                       connector={<ColorlibConnector />}
//                     >
//                       <Step
//                         completed={true}
//                         sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//                       >
//                         <StepLabel StepIconComponent={ColorlibStepIcon}>
//                           <Card variant="outlined" sx={{ textAlign: "center", width: 200 }}>
//                             <Box sx={{ bgcolor: '#EDF7F6' }}>
//                               <Typography sx={{ fontSize: 12, py: 1 }}>
//                                 {depMap.name} <br /> [{depMap.DepCode}]
//                               </Typography>
//                             </Box>
//                             <Box >
//                               <Typography sx={{ fontSize: 12, py: 1 }}>
//                                 {depMap.OwnerCode} [{depMap.PositionCode}]
//                               </Typography>
//                             </Box>
//                           </Card>
//                         </StepLabel>
//                       </Step>
//                     </Stepper>
//                     <Stack
//                       // direction="row"
//                       spacing={1}
//                       sx={{
//                         py: 2,
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       {users.filter((usersFil) => usersFil.EmpUpper === depMap.OwnerCode)
//                         .slice() // สร้างสำเนาอาร์เรย์เพื่อไม่ให้กระทบข้อมูลเดิม
//                         .reverse() // เรียงลำดับย้อนกลับ
//                         .map((hierarchyMap, hierarchyIndex) => (
//                           <Card variant="outlined" sx={{ textAlign: "center", width: 200 }}>
//                             <Box>
//                               <Typography sx={{ fontSize: 12, py: 1 }}>
//                                 {hierarchyMap.UserCode} [{hierarchyMap.PositionCode}]
//                               </Typography>
//                             </Box>
//                           </Card>
//                         ))}
//                     </Stack>
//                   </Grid>
//                 ))}
//             </Grid>
//           )}
//         </CardContent>
//       </Card>
//     </React.Fragment>
//   );
// }