import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { dataConfig } from '../../../config';
import { RequestCreateDocument, FAControlCreateDetail, WorkflowApproval } from '../../../type/nacType';
import BackspaceIcon from '@mui/icons-material/Backspace';
import UpdateIcon from '@mui/icons-material/Update';
import dayjs from 'dayjs';
import { Box, CircularProgress } from '@mui/material';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/th'


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

interface DataFromHeader {
  createDoc: RequestCreateDocument[],
  setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>,
  detailNAC: FAControlCreateDetail[],
  idSection: number | null | undefined,
  workflowApproval: WorkflowApproval[]
  setCreateDoc: React.Dispatch<React.SetStateAction<RequestCreateDocument[]>>,
}

export default function ButtonStates({ createDoc, setOpenBackdrop, detailNAC, idSection, workflowApproval, setCreateDoc }: DataFromHeader) {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const permission = localStorage.getItem('permission_MenuID');
  const parsedPermission = permission ? JSON.parse(permission) : null;
  const checkAt = workflowApproval.find(res => (res.approverid ?? 0) === parseInt(parsedData.userid ?? 0))
  const [hideBT, setHideBT] = React.useState<boolean>(false)

  const validateFieldsAsset = (dtl: FAControlCreateDetail, nac_type: number, status: number) => {
    // Check if any of the required fields are missing
    const missingFields = [];

    if (!dtl.nacdtl_assetsCode) missingFields.push('รหัสทรัพย์สิน');
    // if (!dtl.nacdtl_image_1 && [1, 2].includes(nac_type) && status === 4) missingFields.push('รูปภาพที่ 1');
    // if (!dtl.nacdtl_image_2 && [1, 2].includes(nac_type) && status === 4) missingFields.push('รูปภาพที่ 2');
    if (!dtl.nacdtl_image_1 && [4, 5].includes(nac_type)) missingFields.push('รูปภาพที่ 1');
    if (!dtl.nacdtl_image_2 && [4, 5].includes(nac_type)) missingFields.push('รูปภาพที่ 2');
    if ((dtl.nacdtl_PriceSeals === undefined || dtl.nacdtl_PriceSeals === null) && [4, 5].includes(idSection ?? 0)) missingFields.push('ราคาขาย');

    return missingFields;
  };

  const validateFields = (doc: RequestCreateDocument) => {
    // Check if any of the required fields are missing
    const missingFields = [];

    if (!doc.source_usercode) missingFields.push('ผู้ส่งมอบ');
    if (!doc.sourceFristName) missingFields.push('ชื่อผู้ส่งมอบ');
    if (!doc.sourceLastName) missingFields.push('นามสกุลผู้ส่งมอบ');
    if (!doc.des_usercode && [1, 2].includes(idSection ?? 0)) missingFields.push('ผู้รับมอบ');

    return missingFields;
  };

  const submitDoc = async () => {

    const uniquePrefixes = Array.from(
      new Set(
        detailNAC
          .map(item => item.nacdtl_assetsCode?.substring(0, 2)) // ตัดตัวอักษร 2 ตัวแรก
          .filter(prefix => prefix) // กรอง null หรือ undefined ออก
      )
    );

    if (uniquePrefixes.length > 1) {
      Swal.fire({
        icon: "warning",
        title: `พบรายการทรัพย์สินที่มีประเภทไม่ตรงกัน [${uniquePrefixes}]`,
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      try {
        const header = [...createDoc]
        header[0].usercode = parsedData.UserCode;
        setHideBT(true);
        setOpenBackdrop(true)
        const missingFields = validateFields(createDoc[0]);
        if (missingFields.length > 0) {
          setOpenBackdrop(false)
          setHideBT(false);
          Swal.fire({
            icon: "warning",
            title: `กรุณาระบุข้อมูล ${missingFields.join(', ')} ให้ครบ`,
            showConfirmButton: false,
            timer: 1500
          })
          return; // Exit the function if there are missing fields
        }

        // Validate each item
        for (const item of detailNAC) {
          const missingFields = validateFieldsAsset(item, createDoc[0].nac_type ?? 0, createDoc[0].nac_status ?? 0);
          if (missingFields.length > 0) {
            setOpenBackdrop(false)
            setHideBT(false);
            Swal.fire({
              icon: "warning",
              title: `กรุณาระบุข้อมูล ${missingFields.join(', ')} ให้ครบ`,
              showConfirmButton: false,
              timer: 1500
            })
            return; // Exit the function if there are missing fields
          }
        }
        const res = await Axios.post(
          dataConfig.http + '/FA_Control_Create_Document_NAC',
          createDoc[0], // assuming you're sending only the first document
          dataConfig.headers
        );
        if (res.status === 200 && res.data[0].nac_code) {
          sendDataToAPI(res.data[0].nac_code)
        }
      } catch (error) {
        setOpenBackdrop(false)
        setHideBT(false);
        Swal.fire({
          icon: "error",
          title: `Error sending data to API: ${error}`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  }

  const checkWorkflow = (workflowApproval: WorkflowApproval[], sumPrice: number) => {

    const lengthLessProce: number = workflowApproval.filter(res => (res.limitamount ?? 0) < sumPrice).length // สำหรับเช็คที่สถานะ รอยืนยัน
    const hasLevelZero = workflowApproval.some((item) => item.workflowlevel === 0); // สำหรับกรอก bookvalue ถ้ามี level 0
    const hasLimitBelowSum = workflowApproval.some((item) => (item.limitamount ?? 0) < sumPrice && (item.workflowlevel !== 0)); // น้อยกว่าต้นรวม
    const hasLimitAboveOrEqualSum = workflowApproval.some((item) => (item.limitamount ?? 0) >= sumPrice); // มากกว่าต้นรวม

    if ([1, 2, 3].includes(createDoc[0].nac_type ?? 0)) {
      if ([1].includes(createDoc[0].nac_status ?? 0) && [2, 3].includes(createDoc[0].nac_type ?? 0)) {
        const header = [...createDoc]
        header[0].nac_status = lengthLessProce > 0 ? 2 : 3
        setCreateDoc(header)
        submitDoc()
      } else if ([1].includes(createDoc[0].nac_status ?? 0) && [1].includes(createDoc[0].nac_type ?? 0)) {
        const header = [...createDoc]
        header[0].nac_status = 4
        setCreateDoc(header)
        submitDoc()
      } else if ([2].includes(createDoc[0].nac_status ?? 0)) {
        const header = [...createDoc]
        header[0].verify_by_userid = parseInt(parsedData.userid)
        header[0].verify_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status =
          (workflowApproval.find(res => ((res.limitamount ?? 0) >= sumPrice)
            && ((res.approverid ?? 0) === parseInt(parsedData.userid))) || parsedPermission.includes(10)) ?
            3 : 2
        setCreateDoc(header)
        submitDoc()
      } else if ([3].includes(createDoc[0].nac_status ?? 0)) {
        const header = [...createDoc]
        header[0].source_approve_userid = parseInt(parsedData.userid)
        header[0].source_approve_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status = 5
        setCreateDoc(header)
        submitDoc()
      } else if ([4].includes(createDoc[0].nac_status ?? 0)) {
        const header = [...createDoc]
        header[0].nac_status = 5
        setCreateDoc(header)
        submitDoc()
      } else if ([5].includes(createDoc[0].nac_status ?? 0)) {
        const header = [...createDoc]
        header[0].account_aprrove_id = parseInt(parsedData.userid)
        header[0].account_aprrove_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status = 6
        setCreateDoc(header)
        submitDoc()
      }
    } else if ([4, 5].includes(createDoc[0].nac_type ?? 0)) {
      if (hasLevelZero && [1].includes(createDoc[0].nac_status ?? 0)) {       // สถานะรอยืนยัน -> กรอก BV
        const header = [...createDoc]
        header[0].nac_status = 11
        setCreateDoc(header)
        submitDoc()
      } else if (hasLimitAboveOrEqualSum && hasLimitBelowSum && [11].includes(createDoc[0].nac_status ?? 0)) {// กรอก BV -> รอตรวจสอบ
        const header = [...createDoc]
        header[0].nac_status = 2
        setCreateDoc(header)
        submitDoc()
      } else if (hasLimitAboveOrEqualSum && !hasLimitBelowSum && [11].includes(createDoc[0].nac_status ?? 0)) { // กรอก BV -> รออนุมัติ
        const header = [...createDoc]
        header[0].nac_status = 3
        setCreateDoc(header)
        submitDoc()
      } else if ([2].includes(createDoc[0].nac_status ?? 0)) { //รอตรวจสอบ -> รออนุมัติ
        const header = [...createDoc]
        header[0].verify_by_userid = parseInt(parsedData.userid)
        header[0].verify_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status =
          (workflowApproval.find(res => ((res.limitamount ?? 0) >= sumPrice)
            && ((res.approverid ?? 0) === parseInt(parsedData.userid))) || parsedPermission.includes(10)) ?
            3 : 2
        setCreateDoc(header)
        submitDoc()
      } else if ([3].includes(createDoc[0].nac_status ?? 0)) { //รออนุมัติ -> กรอกราคาขาย
        const header = [...createDoc]
        header[0].source_approve_userid = parseInt(parsedData.userid)
        header[0].source_approve_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status = (typeof createDoc[0].real_price === 'number' || [4].includes(createDoc[0].nac_type ?? 0)) ? 15 : 12
        setCreateDoc(header)
        submitDoc()
      } else if ([12].includes(createDoc[0].nac_status ?? 0)) { //กรอกราคาขาย -> รอบัญชี หรือ ปิดรายการ
        const totalPriceSeals = detailNAC.reduce((sum, item) => {
          return item.nacdtl_PriceSeals ? sum + item.nacdtl_PriceSeals : sum;
        }, 0);
        const header = [...createDoc]
        header[0].source_approve_userid = (createDoc[0].real_price ?? 0) < totalPriceSeals ? null : (createDoc[0].source_approve_userid ?? null)
        header[0].source_approve_date = (createDoc[0].real_price ?? 0) < totalPriceSeals ? null : (createDoc[0].source_approve_date ?? null)
        header[0].nac_status = (createDoc[0].real_price ?? 0) < totalPriceSeals ? 3 : 15
        setCreateDoc(header)
        submitDoc()
      } else if ([15].includes(createDoc[0].nac_status ?? 0)) { //รอบัญชี -> การเงิน
        const header = [...createDoc]
        header[0].account_aprrove_id = parseInt(parsedData.userid)
        header[0].account_aprrove_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status = 13
        setCreateDoc(header)
        submitDoc()
      } else if ([13].includes(createDoc[0].nac_status ?? 0)) { //การเงิน -> ปิดรายการ
        const header = [...createDoc]
        header[0].finance_aprrove_id = parseInt(parsedData.userid)
        header[0].finance_aprrove_date = dayjs.tz(new Date(), "Asia/Bangkok")
        header[0].nac_status = 6
        setCreateDoc(header)
        submitDoc()
      }
    }
  };

  const redo = async () => {
    Swal.fire({
      title: "Do you want to Redo the changes?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Cancel`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const header = [...createDoc]
        header[0].nac_status = 1
        setCreateDoc(header)
        submitDoc()
      }
    });
  }

  const cancelDoc = async () => {
    Swal.fire({
      title: "Do you want to reject the changes?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Cancel`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const header = [...createDoc]
        header[0].nac_status = 17
        setCreateDoc(header)
        submitDoc()
      }
    });
  }

  const sendDataToAPI = async (nac_code: string | null | undefined) => {
    setHideBT(true)
    try {
      // Mapping through each detailNAC item
      const requestData = detailNAC.map((detail, index) => ({
        usercode: parsedData.UserCode,
        nac_code: nac_code,
        nacdtl_row: index,
        nacdtl_assetsCode: detail.nacdtl_assetsCode ?? null,
        nacdtl_bookV: detail.nacdtl_bookV ?? null,
        nacdtl_PriceSeals: detail.nacdtl_PriceSeals ?? null,
        nacdtl_profit: detail.nacdtl_profit ?? null,
        nacdtl_image_1: detail.nacdtl_image_1 ?? null,
        nacdtl_image_2: detail.nacdtl_image_2 ?? null,
      }));
      for (let i = 0; i < requestData.length; i++) {
        const response = await Axios.post(dataConfig.http + '/FA_Control_Create_Detail_NAC', requestData[i], dataConfig.headers);
        if (response.status === 200 && (response.data[0].count_nac === requestData.length)) {
          setOpenBackdrop(false);
          Swal.fire({
            icon: "success",
            title: `บันทึกข้อมูลสำเร็จ`,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = `/NAC_CREATE?id=${idSection}?nac_code=${response.data[0].nac_code}`;
          })
        }
      }
    } catch (error: unknown) {
      setOpenBackdrop(false);
      setHideBT(false)
      Swal.fire({
        icon: "error",
        title: `Error sending data to API: ${error}`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  };

  if (!hideBT) {
    return (
      <Stack direction="row" spacing={2} sx={{ py: 2 }}>
        {
          (([1, 4, 11, 12, 14].includes(createDoc[0].nac_status ?? 0) || parsedPermission.includes(10)) && createDoc[0].nac_code) &&
          <Button variant="contained" color="warning" endIcon={<UpdateIcon />} onClick={submitDoc}>UPDATE</Button>
        }
        {![6].includes(createDoc[0].nac_status ?? 0) &&
          <>
            {!createDoc[0].nac_code && <Button variant="contained" endIcon={<SendIcon />} onClick={submitDoc}>SUBMIT</Button>}
            {
              (([11].includes(createDoc[0].nac_status ?? 0) && checkAt)
                || (createDoc[0].nac_code && [11, 12, 16].some((val) => parsedPermission.includes(val)) && [11, 13, 15, 5].includes(createDoc[0].nac_status ?? 0))
                || [1, 12, 4].includes(createDoc[0].nac_status ?? 0)) &&
              <Button variant="contained" endIcon={<SendIcon />} onClick={() => checkWorkflow(workflowApproval, createDoc[0].sum_price ?? 0)}>SUBMIT</Button>
            }
            {([2, 3].includes(createDoc[0].nac_status ?? 0)) &&
              <>
                {
                  (checkAt || parsedPermission.includes(16)) &&
                  <Button variant="contained" color="secondary" onClick={redo} endIcon={<BackspaceIcon />}>REDO</Button>
                }
                {
                  (checkAt || parsedPermission.includes(10)) &&
                  <Button variant="contained" color="success" endIcon={<SendIcon />} onClick={() => checkWorkflow(workflowApproval, createDoc[0].sum_price ?? 0)}>APPROVED</Button>
                }
                {
                  (checkAt || parsedPermission.includes(10)) &&
                  <Button variant="contained" color="error" onClick={cancelDoc} endIcon={<DeleteIcon />}>REJECTED</Button>
                }
              </>
            }
          </>
        }
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" spacing={2} sx={{ py: 2 }}>
        <Box component="main">
          <CircularProgress disableShrink />
        </Box>
      </Stack>
    );
  }
}