import { Dayjs } from 'dayjs'; // Import Dayjs


export interface DataUser {
  UserID: number;          // ค่าที่ดูเหมือนเป็นหมายเลข ID
  UserCode: string;        // รหัสผู้ใช้
  Name: string | null;            // ชื่อเต็มของผู้ใช้
  BranchID: number;        // รหัสสาขา
  DepID: number;
  SecCode: string | null;    // รหัสแผนก
  Email: string | null;           // อีเมลผู้ใช้
  DepCode: string;         // รหัสแผนก
  UserType: string | null; // ประเภทผู้ใช้ อาจเป็น string หรือ null
  fristName: string | null;       // ชื่อจริงของผู้ใช้ (อาจว่าง)
  lastName: string | null;        // นามสกุลของผู้ใช้ (ปัจจุบันมีค่าเป็น 'undefined')
  img_profile: string | null | undefined;
  Tel: string | null | undefined;
  Position: string | null | undefined;
  PositionID: number;
  PositionCode: string | null | undefined;
  Actived: boolean;
  EmpUpper: string | null | undefined;
  password: string | null | undefined;
}

export interface DataAsset {
  AssetID: string;            // รหัสสินทรัพย์
  Code: string;               // รหัสสินค้า
  Name: string;               // ชื่อสินทรัพย์
  AssetTypeID: string | null; // ประเภทสินทรัพย์ (อาจเป็น null)
  Asset_group: string;        // กลุ่มสินทรัพย์
  Group_name: string;         // ชื่อกลุ่ม
  SupplierID: string | null;  // รหัสผู้จัดจำหน่าย (อาจเป็น null)
  BranchID: number;           // รหัสสาขา
  OwnerID: number;            // รหัสเจ้าของ
  DepID: number;              // รหัสแผนก
  SecID: string | null;       // รหัสส่วนงาน (อาจเป็น null)
  Details: string;            // รายละเอียดสินทรัพย์
  WarrantyBegin: string | null; // วันที่เริ่มต้นการรับประกัน (อาจเป็น null)
  WarrantyEnd: string | null; // วันที่สิ้นสุดการรับประกัน (อาจเป็น null)
  SerialNo: string;           // หมายเลขซีเรียล
  Price: number;              // ราคาสินทรัพย์
  InvoiceNo: string | null;   // หมายเลขใบแจ้งหนี้ (อาจเป็น null)
  InvoiceDate: string | null; // วันที่ใบแจ้งหนี้ (อาจเป็น null)
  AccountCode: string | null; // รหัสบัญชี (อาจเป็น null)
  StatusID: string | null;    // สถานะ (อาจเป็น null)
  CreateBy: string;           // ผู้สร้างรายการ
  CreateDate: string;         // วันที่สร้าง
  UpdateBy: string;           // ผู้แก้ไขล่าสุด
  UpdateDate: string;         // วันที่แก้ไขล่าสุด
  Position: string;           // ตำแหน่งสินทรัพย์
  ImagePath: string;          // URL รูปภาพ
  active: number;             // สถานะการใช้งาน
  ImagePath_2: string;        // URL รูปภาพที่สอง
  PositionNumber: string | null; // หมายเลขตำแหน่ง (อาจเป็น null)
  bac_status: number;         // สถานะ bac
  CommitDate: string;         // วันที่ commit
  type_group: string;         // ประเภทกลุ่ม
  OwnerCode: string;          // รหัสเจ้าของ
  BranchName: string;         // ชื่อสาขา
}


export interface MenuItemTree {
  id: string;
  menuName: React.ReactNode;
  menu_url: string;
  permission: boolean;
  permission_branch: boolean;
}

// Define TypeScript interface for the data structure
export interface PermissionData {
  permission_id: number;
  menutypename: string;
  menutypeid: number;
  userId: number;
  depId: number;
  permission_menuId: number;
  menu_name: string;
  permission_approve: boolean;
  permission_delete: boolean;
  active: boolean;
  menuid: number;
}

export interface RequestCreateDocument {
  usercode: string | null | undefined;
  nac_code: string | null | undefined;
  nac_type: number | null | undefined;
  status_name: string | null | undefined;
  nac_status: number | null | undefined;
  source_dep_owner: string | null | undefined;
  source_bu_owner: string | null | undefined;
  source_usercode: string | null | undefined; // Added alias
  source_userid: Number | null | undefined;
  source_name: string | null | undefined;
  source_date: Dayjs | null | undefined;
  source_approve_usercode: string | null | undefined; // Added alias
  source_approve_userid: Number | null | undefined;
  source_approve_date: Dayjs | null | undefined;
  source_remark: string | null | undefined;
  des_dep_owner: string | null | undefined;
  des_bu_owner: string | null | undefined;
  des_usercode: string | null | undefined; // Added alias
  des_userid: Number | null | undefined;
  des_name: string | null | undefined;
  des_date: Dayjs | null | undefined;
  des_approve_usercode: string | null | undefined; // Added alias
  des_approve_userid: Number | null | undefined;
  des_approve_date: Dayjs | null | undefined;
  des_remark: string | null | undefined;
  verify_by_usercode: string | null | undefined; // Added alias
  verify_by_userid: Number | null | undefined;
  verify_date: Dayjs | null | undefined;
  sum_price: number | null | undefined;
  create_by: string | null | undefined;
  create_date: Dayjs | null | undefined;
  account_aprrove_usercode: string | null | undefined; // Added alias
  account_aprrove_id: Number | null | undefined;
  account_aprrove_date: Dayjs | null | undefined;
  real_price: number | null | undefined;
  realPrice_Date: Dayjs | null | undefined;
  finance_aprrove_usercode: string | null | undefined; // Added alias
  finance_aprrove_id: Number | null | undefined;
  finance_aprrove_date: Dayjs | null | undefined;
  desFristName: string | null | undefined;
  desLastName: string | null | undefined;
  sourceFristName: string | null | undefined;
  sourceLastName: string | null | undefined;
}

export interface FAControlCreateDetail {
  usercode: string | null | undefined; // user ที่ทำรายการขออนุมัติ
  nac_code: string | null | undefined;
  nacdtl_row: number | null | undefined; // แถวของ Detail
  nacdtl_assetsCode: string | null | undefined; // assets code
  OwnerCode: string | null | undefined;
  nacdtl_assetsName: string | null | undefined;
  nacdtl_assetsSeria: string | null | undefined;
  nacdtl_assetsDtl: string | null | undefined;
  nacdtl_assetsPrice: number;
  create_date: Dayjs | null | undefined;
  nacdtl_bookV: number | null | undefined;
  nacdtl_PriceSeals: number | null | undefined;
  nacdtl_profit: number | null | undefined;
  nacdtl_image_1: string | null | undefined; // assets code
  nacdtl_image_2: string | null | undefined; // assets code
}

export interface ListNACHeaders {
  nac_code: string | null | undefined;
  nac_status: number | null | undefined;
  status_name: string | null | undefined;
  sum_price: number | null | undefined;
  name: string | null | undefined;
  workflowtypeid: number | null | undefined;
  create_date: Date | null | undefined;
  verify_by_userid: string | null | undefined;
  source_approve_userid: string | null | undefined;
  create_by: string | null | undefined;
  source_userid: string | null | undefined;
  des_userid: string | null | undefined;
  userid_approver: string | null | undefined;
  TypeCode: string | null | undefined;
}

export interface FilterListNACHeaders {
  nac_code: string | null | undefined;
  name: string | null | undefined;
  source_userid: string | null | undefined;
  des_userid: string | null | undefined;
  status_name: string | null | undefined;
}

export interface WorkflowApproval {
  workflowlevel: number | null | undefined;  // Assuming this is an integer
  name: string | null | undefined;
  approverid: string | null | undefined;     // Assuming approverid is a string (user code)
  limitamount: number | null | undefined;    // Assuming limitamount is a numeric value
  pendingday: number | null | undefined;     // Assuming pendingday is a number (days pending)
  status: number | null | undefined;         // Assuming status is a string
}

export interface Period {
  PeriodID: number | null | undefined; // หรืออาจจะเป็น string ขึ้นอยู่กับข้อมูลในฐานข้อมูล
  BeginDate: Dayjs | null | undefined; // เนื่องจากใช้ convert(varchar, ...)
  EndDate?: Dayjs | null | undefined; // เนื่องจากใช้ convert(varchar, ...)
  BranchID?: number | string; // หรือ number ขึ้นอยู่กับข้อมูล
  Description?: string | null | undefined;
  DepCode?: string | null | undefined;
  personID?: string | null | undefined; // หรือ number ขึ้นอยู่กับข้อมูล
  Code?: string | null | undefined; // หรือ number ขึ้นอยู่กับข้อมูล
}

export interface SqlInputParameters {
  begindate: Dayjs;
  enddate: Dayjs;
  branchid: string | undefined | null;
  description: string | undefined | null;
  usercode: string;
  depcode: string | undefined | null;
  personID: string | undefined | null;
  keyID: string | undefined | null;
}

export interface Department {
  depid: number;
  depcode: string;
  name: string;
  FuncID: number;
  depname: string;
}

export interface Branch {
  branchid: number;
  name: string;
}

export interface AssetRecord {
  AssetID: number | null | undefined;
  Code: string | null | undefined;
  Name: string | null | undefined;
  BranchID: number | null | undefined;
  Details: string | null | undefined;
  typeCode: string | null | undefined;
  SerialNo: string | null | undefined;
  Asset_group: string | null | undefined;
  Group_name: string | null | undefined;
  nac_processing: string | null | undefined;
  Price: number | null | undefined;
  CreateDate: string | null | undefined; // Or Date if handling as Date object
  UpdateDate: string | null | undefined; // Assuming the result from the function is a string date
  UpdateBy: string | null | undefined;   // Username returned from the function
  Position: string | null | undefined;
  OwnerID: string | null | undefined;    // Assuming this is the username returned from the function
  ImagePath: string | null | undefined;  // Nullable, based on your use case
  ImagePath_2: string | null | undefined; // Nullable, based on your use case
  bac_status: string | null | undefined;  // Nullable, depending on the field usage
  Old_Details: string | null | undefined; // Old details as returned from the function
  Old_UpdateBy: string | null | undefined; // Old update by user code
  Old_UpdateDate: string | null | undefined; // Old update date, assuming it's a string date
}

export interface CountAssetRow {
  Code: string | null | undefined;
  Name: string | null | undefined;
  OwnerID: string | null | undefined;
  Position: string | null | undefined;
  Date: Dayjs | null | undefined; // or another suitable type for date handling
  EndDate_Success: Dayjs | null | undefined;
  UserID: string | null | undefined;
  detail: string | null | undefined;
  Reference: string | null | undefined;
  comment: string | null | undefined;
  remarker: string | null | undefined;
  RoundID?: string | null | undefined; // Assuming this might be nullable or optional
  RowID: number | null | undefined;
  typeCode: string;
  ImagePath: string | null | undefined;
  ImagePath_2: string | null | undefined;
}

export interface PeriodDescription {
  PeriodID: string;
  Description: string;
  BranchID: number;
  DepCode: string;
  personID: string;
}

export interface UpdateDtlAssetParams {
  Code: string;
  Name: string | null | undefined;
  Asset_group: string | null | undefined;
  Group_name: string | null | undefined;
  BranchID: number | null | undefined;
  OwnerCode: string | null | undefined;
  Details: string | null | undefined;
  SerialNo: string | null | undefined;
  Price: number | null | undefined;
  ImagePath: string | null | undefined;
  ImagePath_2: string | null | undefined;
  Position?: string | null | undefined;
  UserCode: string;
}

export interface NACDetailHistory {
  nacdtl_id: number | null | undefined;
  nac_code: string | null | undefined;
  nacdtl_assetsCode: string | null | undefined;
  name: string | null | undefined;
  nacdtl_assetsName: string | null | undefined;
  nacdtl_assetsPrice: number | null | undefined;
  nacdtl_bookV: number | null | undefined;
  nacdtl_PriceSeals: number | null | undefined;
  nacdtl_profit: number | null | undefined;
  nacdtl_date_asset: Dayjs | null | undefined;
  typeCode: string;
  update_date: Dayjs | null | undefined;
  create_by: string | null | undefined;
  source_approve_userid: string | null | undefined;
  account_approve_id: string | null | undefined;
}

export interface NAC_Backlog {
  source_dep_owner: string | null | undefined;
  add_nac: number | null | undefined;
  tranfer_nac: number | null | undefined;
  delete_nac: number | null | undefined;
  sell_nac: number | null | undefined;
}

export interface QureyNAC_Comment {
  comment: string | null | undefined;
  create_date: Dayjs | null | undefined;
  userid: string | null | undefined;
}

export interface QureyNAC_File {
  description: string | null | undefined;
  linkpath: string | null | undefined;
  create_date: Dayjs | null | undefined;
  userid: string | null | undefined;
}

export interface SentNAC_File {
  nac_code: string | null | undefined;
  description: string | null | undefined;
  linkpath: string | null | undefined;
  create_date: Dayjs | null | undefined;
  usercode: string | null | undefined;
}

export interface UserInfo {
  userid: string;
  manager: string | null;
  name: string;
  UserCode: string;
  ad: string;
  dep: string;
  branchid: number;
  depid: number;
  depcode: string;
  depname: string;
  secid: number;
  seccode: string;
  secname: string;
  positionid: number;
  positioncode: string;
  positionname: string;
  areaid: number;
  password: number;
  changepassword: boolean;
  fristName: string;
  lastName: string;
  img_profile: string | null | undefined;
  Email: string;
}

export interface ResetPass {
  current_password: string | null | undefined;
  new_password: string | null | undefined;
  confirm_password: string | null | undefined;
}

export interface UserSaved {
  firstName: string;
  lastName: string;
  loginName: string;
  branchId: number | null | undefined;
  department: string;
  secId: string;
  positionId: string;
  empUpper?: string | null;
  email: string;
  actived: boolean;
  password: string;
}

export interface Permission {
  Permission_id: string; // รหัสการอนุญาต
  menutypename: string; // ชื่อประเภทเมนู
  menutypeid: number; // ID ของประเภทเมนู
  UserID: string; // ID ของผู้ใช้
  DepID: number; // ID ของแผนก
  Permission_MenuID: number; // รหัสเมนูที่เกี่ยวข้อง
  menu_name: string; // ชื่อเมนู
  Permission_approve: boolean | null; // สิทธิ์การอนุมัติ (true/false/null)
  Permission_delete: boolean | null; // สิทธิ์การลบ (true/false/null)
  Active: boolean; // สถานะใช้งานของเมนู
  menuid: number; // รหัสเมนู
}

export interface MenuPermissionItem {
  menuid: number;
  menu_name: string;
  menutypeid: number;
  hide: boolean;
  active_mobile: boolean;
  active_pc: boolean;
}

export interface Assets_TypeGroup {
  typeGroupID: number;
  typeCode: string;
  typeName: string;
  typeMenu: number;
}

export interface HierarchyData {
  FuncCode: string | null;
  DepID: number | null; // อาจเป็น null ถ้าไม่มีข้อมูลใน Department
  DepCode: string;
  SecCode: string;
  SecName: string;
  FuncName: string;
  name: string;
  OwnerCode: string | null; // อาจเป็น null ถ้าไม่มี OwnerID
  PositionCode: string | null; // อาจเป็น null ถ้าไม่มีตำแหน่ง
  Level: number;
}

export interface EmployeeNode {
  [x: string]: any;
  id: string;
  funcCode: string | null;
  funcName: string | null;
  depCode: string | null;
  depName: string | null;
  secCode: string | null;
  secName: string | null;
  label: string;
  children?: EmployeeNode[];
}