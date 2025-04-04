import React, { useState } from 'react';
import { CardMedia, ImageListItem } from '@mui/material';
import Axios from 'axios';
import { dataConfig } from '../../../../config';
import { CountAssetRow, UpdateDtlAssetParams } from '../../../../type/nacType';

export interface Data {
  imagePath: string;
  name: string;
  rows: CountAssetRow[];
  originalRows: CountAssetRow[];
  index: number;
  fieldData: string;
  setRows: React.Dispatch<React.SetStateAction<CountAssetRow[]>>;
  setOriginalRows: React.Dispatch<React.SetStateAction<CountAssetRow[]>>;
}

const convertToJPG = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const jpgFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
                type: "image/jpeg",
              });
              resolve(jpgFile);
            } else {
              reject(new Error("Failed to convert image to JPG"));
            }
          },
          "image/jpeg",
          0.9 // คุณภาพของ JPG (0.9 = 90%)
        );
      };
    };

    reader.onerror = (error) => reject(error);
  });
};

// Create a separate component for rendering the image cell
const ImageCell = ({ imagePath, name, rows, setRows, index, fieldData, originalRows, setOriginalRows }: Data) => {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [imageData, setImageData] = React.useState<string>(imagePath);


  const handleUploadFile = async (indexCode: number) => {
    // แสดงตัวเลือกให้ผู้ใช้เลือกแหล่งที่มาของรูปภาพ
    const choice = window.confirm("คุณต้องการถ่ายรูปจากกล้องหรืออัปโหลดจากอุปกรณ์?\n\nกด 'ตกลง' เพื่อถ่ายรูป หรือ 'ยกเลิก' เพื่ออัปโหลด");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    if (choice) {
      fileInput.capture = "camera"; // เปิดกล้องถ่ายรูป
    }

    fileInput.onchange = async (e: any) => {
      let file = e.target.files[0];
      if (file) {
        try {
          file = await convertToJPG(file); // แปลงเป็น JPG ก่อนอัปโหลด
          const formData_1 = new FormData();
          formData_1.append("file", file);
          formData_1.append("fileName", file.name);

          try {
            const response = await Axios.post(
              `http://vpnptec.dyndns.org:32001/api/check_files_NewNAC`,
              formData_1,
              dataConfig.headerUploadFile
            );

            if (response.status === 200 && response.data.attach[0].ATT) {
              const selectedImageRes = `http://vpnptec.dyndns.org:33080/NEW_NAC/${response.data.attach[0].ATT}.jpg`;

              // อัปเดตข้อมูลภาพ
              const indexOriginalRows = originalRows.findIndex((row) => row.Code === rows[indexCode].Code);
              const list = [...rows];
              const listOriginalRows = [...originalRows];

              list[indexCode]['ImagePath'] = fieldData === 'ImagePath' ? selectedImageRes : list[indexCode].ImagePath;
              list[indexCode]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImageRes : list[indexCode].ImagePath;
              listOriginalRows[indexOriginalRows]['ImagePath'] = fieldData === 'ImagePath' ? selectedImageRes : listOriginalRows[indexOriginalRows].ImagePath;
              listOriginalRows[indexOriginalRows]['ImagePath_2'] = fieldData === 'ImagePath_2' ? selectedImageRes : listOriginalRows[indexOriginalRows].ImagePath;

              try {
                const response = await Axios.post(
                  `${dataConfig.http}/FA_Mobile_UploadImage`,
                  {
                    Code: list[indexCode].Code ?? '',
                    RoundID: list[indexCode].RoundID ?? '',
                    index: fieldData === 'ImagePath' ? 0 : 1,
                    url: selectedImageRes ?? '',
                  },
                  dataConfig.headers
                );

                if (response.status === 200) {
                  console.log(response.data.attach[0].ATT);
                  setImageData(selectedImageRes);
                  setRows(list);
                  setOriginalRows(listOriginalRows);
                } else {
                  throw new Error('Update failed');
                }
              } catch (error) {
                console.log(JSON.stringify(error));
              }
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } catch (error) {
          console.error("Error converting/uploading file:", error);
        }
      };
    };

    fileInput.click();
  };

  return (
    <React.Fragment>
      <ImageListItem key={index}>
        <CardMedia
          component="img"
          height="160"
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleUploadFile(index)}
          image={imageData || "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_250300515.jpg"}
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
