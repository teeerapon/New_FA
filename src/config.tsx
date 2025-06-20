const httpPTEC = 'http://10.15.100.227:32001/api' //main
const httpLandOffice = 'http://10.20.100.29:33052/api' //TEST
const httpHome = 'http://172.16.4.164:33052/api' //Home
const wifioffice = 'http://10.20.100.14:35002/api'

interface DataConfig {
  http: string;
  httpViewFile: string;
  headers: {
    [key: string]: string;
  };
  headerUploadFile: {
    [key: string]: string;
  };
}

export const dataConfig: DataConfig = {
  headers: {
    'Content-Type': `application/json; charset=utf-8`,
    'Accept': 'application/json'
  },
  headerUploadFile: {
    'Content-Type': `multipart/form-data`,
    'Accept': 'application/json'
  },
  http: httpPTEC,
  httpViewFile: `http://10.15.100.227:33080`
}