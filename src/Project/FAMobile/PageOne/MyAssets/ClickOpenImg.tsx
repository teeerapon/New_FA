import React, { useState } from 'react';
import { Button, CardMedia, Dialog, DialogActions, DialogContent, IconButton, ImageListItem, ImageListItemBar, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Axios from 'axios';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { dataConfig } from '../../../../config';
import { AssetRecord, UpdateDtlAssetParams } from '../../../../type/nacType';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface Data {
  imagePath: string;
  name: string;
  rows: AssetRecord[];
  originalRows: AssetRecord[];
  index: number;
  fieldData: string;
  setRows: React.Dispatch<React.SetStateAction<AssetRecord[]>>;
  setOriginalRows: React.Dispatch<React.SetStateAction<AssetRecord[]>>;
}

// Create a separate component for rendering the image cell
const ImageCell = ({ imagePath, name, rows, setRows, index, fieldData, originalRows, setOriginalRows }: Data) => {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rowEdit, setRowEdit] = React.useState<Partial<UpdateDtlAssetParams>>({});


  const handleClickOpen = (imageUrl: string, indexData: number) => {
    setRowEdit({
      Code: rows[indexData].Code ?? '',
      Name: rows[indexData].Name ?? '',
      Asset_group: rows[indexData].Asset_group ?? '',
      Group_name: rows[indexData].Group_name ?? '',
      BranchID: rows[indexData].BranchID,
      OwnerCode: rows[indexData].OwnerID ?? '',
      Details: rows[indexData].Details ?? '',
      SerialNo: rows[indexData].SerialNo ?? '',
      Price: rows[indexData].Price ?? 0,
      ImagePath: typeof rows[indexData].ImagePath === 'string' || typeof rows[indexData].ImagePath === 'number' ? rows[indexData].ImagePath : '',
      ImagePath_2: typeof rows[indexData].ImagePath === 'string' || typeof rows[indexData].ImagePath === 'number' ? rows[indexData].ImagePath : '',
      Position: rows[indexData].Position ?? '',
      UserCode: typeof parsedData.UserCode === 'string' ? parsedData.UserCode : '', // Ensure UserCode is a string
    })
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };


  const handleCloseSaved = async () => {
    setOpenDialog(false);
    const index = rows.findIndex((row) => row.Code === rowEdit.Code);
    const indexOriginalRows = originalRows.findIndex((row) => row.Code === rowEdit.Code);
    const list = [...rows]
    list[index]['ImagePath'] = fieldData === 'ImagePath' ? selectedImage : rowEdit.ImagePath;
    list[index]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImage : rowEdit.ImagePath;

    const listOriginalRows = [...originalRows]
    listOriginalRows[indexOriginalRows]['ImagePath'] = fieldData === 'ImagePath' ? selectedImage : rowEdit.ImagePath;
    listOriginalRows[indexOriginalRows]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImage : rowEdit.ImagePath;

    setRows(list);
    setOriginalRows(listOriginalRows)
    try {
      const response = await Axios.post(
        `${dataConfig.http}/UpdateDtlAsset`,
        list[index],
        dataConfig.headers
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: 'แก้ไขรายการสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.log(JSON.stringify(error));

    }
  };

  const handleUploadFile = async () => {
    // แสดงตัวเลือกให้ผู้ใช้เลือกแหล่งที่มาของรูปภาพ
    const choice = window.confirm("คุณต้องการถ่ายรูปจากกล้องหรืออัปโหลดจากอุปกรณ์?\n\nกด 'ตกลง' เพื่อถ่ายรูป หรือ 'ยกเลิก' เพื่ออัปโหลด");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    if (choice) {
      fileInput.capture = "camera"; // เปิดกล้องถ่ายรูป
    }

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Get file extension
      if (file) {
        const formData_1 = new FormData();
        formData_1.append("file", file);
        formData_1.append("fileName", file.name);
        try {
          const response = await Axios.post(
            // `${dataConfig.http}/check_files_NewNAC`,
            `http://vpnptec.dyndns.org:32001/api/check_files_NewNAC`,
            formData_1,
            dataConfig.headerUploadFile
          );
          const selectedImageRes = `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`
          setSelectedImage(selectedImageRes);

          const index = rows.findIndex((row) => row.Code === rowEdit.Code);
          const indexOriginalRows = originalRows.findIndex((row) => row.Code === rowEdit.Code);
          const list = [...rows]
          list[index]['ImagePath'] = fieldData === 'ImagePath' ? selectedImageRes : rowEdit.ImagePath;
          list[index]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImageRes : rowEdit.ImagePath;
          const listOriginalRows = [...originalRows]
          listOriginalRows[indexOriginalRows]['ImagePath'] = fieldData === 'ImagePath' ? selectedImageRes : rowEdit.ImagePath;
          listOriginalRows[indexOriginalRows]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImageRes : rowEdit.ImagePath;
          setRows(list);
          setOriginalRows(listOriginalRows)
          try {
            const response = await Axios.post(
              `${dataConfig.http}/UpdateDtlAsset`,
              list[index],
              dataConfig.headers
            );

            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: 'แก้ไขรายการสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              throw new Error('Update failed');
            }
          } catch (error) {
            console.log(JSON.stringify(error));

          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };

    fileInput.click();
  };

  return (
    <React.Fragment>
      <ImageListItem key={index}>
        <CardMedia
          key={imagePath}
          component="img"
          height="160"
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={handleUploadFile}
          image={imagePath || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
          }}
          alt={`${name}_1`}
        />
      </ImageListItem>
    </React.Fragment>
  );
};

export default ImageCell;
