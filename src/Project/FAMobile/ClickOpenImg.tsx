import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, IconButton, ImageListItem, ImageListItemBar, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Axios from 'axios';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { dataConfig } from '../../config';
import { AssetRecord, UpdateDtlAssetParams } from '../../type/nacType';

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

  const handleUploadFile_2 = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const allowedImageExtensions = ['jpg', 'png', 'gif', 'xbm', 'tif', 'pjp', 'svgz', 'jpeg', 'jfif', 'bmp', 'webp', 'svg'];

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Get file extension

      if (fileExtension && allowedImageExtensions.includes(fileExtension)) {
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
          setSelectedImage(`http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`);
          console.log(response);

        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: 'ไฟล์ประเภทนี้ไม่ได้รับอนุญาติให้ใช้งานในระบบ \nใช้ได้เฉพาะ .csv, .xls, .txt, .ppt, .doc, .pdf, .jpg, .png, .gif',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  const handleUploadFile_1 = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const allowedImageExtensions = ['jpg', 'png', 'gif', 'xbm', 'tif', 'pjp', 'svgz', 'jpeg', 'jfif', 'bmp', 'webp', 'svg'];

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Get file extension

      if (fileExtension && allowedImageExtensions.includes(fileExtension)) {
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
          setSelectedImage(`http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.${fileExtension}`);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: 'ไฟล์ประเภทนี้ไม่ได้รับอนุญาติให้ใช้งานในระบบ \nใช้ได้เฉพาะ .csv, .xls, .txt, .ppt, .doc, .pdf, .jpg, .png, .gif',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };

  return (
    <>
      <ImageListItem key={imagePath}>
        <img
          src={imagePath}
          alt={name}
          style={{ height: 140, objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleClickOpen(imagePath, index)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
          }}
          loading="lazy"
        />
      </ImageListItem>

      {/* Dialog for displaying the image */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpenDialog(false)
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ textAlign: 'center' }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedImage || ''}
              alt={name}
              style={{ width: '100%', height: 'auto', maxWidth: '400px', maxHeight: '60vh' }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg";
              }}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              sx={{ maxWidth: '400px' }}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <input hidden type="file" name='file' accept='image/*'
                onChange={(e) => {
                  if (fieldData === 'ImagePath') {
                    handleUploadFile_1(e, index ?? 0)
                  } else if (fieldData === 'ImagePath_2') {
                    handleUploadFile_2(e, index ?? 0)
                  }
                }}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaved}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCell;
