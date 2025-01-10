import { AssetRecord } from '../../../type/nacType';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (rows: AssetRecord[]) => {

  const getFormattedDate = (): string => {
    const today: Date = new Date();
    const day: string = String(today.getDate()).padStart(2, '0');
    const month: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year: string = String(today.getFullYear());
    return `${day}${month}${year}`;
  };

  const formatDateTime = (dateInput: Date | string): string => {
    if (!dateInput) return 'Invalid date';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid date';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formattedDate: string = getFormattedDate();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('NAC Data');

  // Define headers
  const headers = [
    { key: 'Code', header: 'รหัสทรัพย์สิน', },
    { key: 'Name', header: 'ชื่อทรัพย์สิน', },
    { key: 'SerialNo', header: 'SerialNo', },
    { key: 'OwnerID', header: 'ผู้ถือครอง', },
    { key: 'Position', header: 'Location NAC', },
    { key: 'Asset_group', header: 'Asset Group', },
    { key: 'Group_name', header: 'Group Name', },
    { key: 'Details', header: 'รายละเอียด', },
    { key: 'Price', header: 'ราคาทุน', },
    { key: 'CreateDate', header: 'วันที่ขึ้นทะเบียน', },
    { key: 'ImagePath', header: 'รูปภาพที่ 1', },
    { key: 'ImagePath_2', header: 'รูปภาพที่ 2', },
  ];

  // Add headers to worksheet
  worksheet.columns = headers.map(header => ({
    header: header.header,
    key: header.key,
    width: 20 // Set initial width, adjust later based on content
  }));

  // Style header row
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '404040' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Function to fetch image as buffer
  const fetchImageBuffer = async (url: string): Promise<Buffer | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob.arrayBuffer().then(buffer => Buffer.from(buffer));
    } catch (error) {
      console.error(`Error fetching image from ${url}:`, error);
      return null;
    }
  };

  // Add rows to the worksheet
  for (const item of rows) {
    const formattedItem = {
      ...item,
      CreateDate: item.CreateDate ? formatDateTime(item.CreateDate) : '',
    };

    const row = worksheet.addRow(formattedItem);

    // Add images to cells if available
    // if (item.ImagePath) {
    //   const imageBuffer = await fetchImageBuffer(item.ImagePath);
    //   if (imageBuffer) {
    //     const imageId = workbook.addImage({
    //       buffer: imageBuffer,
    //       extension: 'jpeg', // or png depending on your image type
    //     });

    //     // Define the position and size of the image in the cell
    //     worksheet.addImage(imageId, {
    //       tl: { col: 10, row: row.number - 1 }, // Top-left corner
    //       ext: { width: 100, height: 100 }, // Size of the image
    //     });
    //   }
    // }

    // if (item.ImagePath_2) {
    //   const imageBuffer2 = await fetchImageBuffer(item.ImagePath_2);
    //   if (imageBuffer2) {
    //     const imageId2 = workbook.addImage({
    //       buffer: imageBuffer2,
    //       extension: 'jpeg',
    //     });

    //     worksheet.addImage(imageId2, {
    //       tl: { col: 11, row: row.number - 1 },
    //       ext: { width: 100, height: 100 },
    //     });
    //   }
    // }
  }

  // Adjust column widths based on content
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
    }
    column.width = Math.min(40, maxLength + 2); // Set a limit for the maximum column width
  });

  // Generate Excel file and trigger download
  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `NAC_Export_${formattedDate}.xlsx`);
  }).catch((error: Error) => {
    console.error('Error exporting Excel:', error);
  });
};
