import { checkPlatform } from "@/utils/helper";
import { getCookie, isLogin } from "@/utils/auth";
import axios from "axios";

// 全局地址
if (checkPlatform.electron()) {
  axios.defaults.baseURL = "/api";
} else {
  axios.defaults.baseURL = import.meta.env["RENDERER_VITE_SERVER_URL"];
}

// 基础配置
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;

// 请求拦截
axios.interceptors.request.use(
  (request) => {
    if (!request.params) request.params = {};
    // 附加 cookie
    if (!request.noCookie && (isLogin() || getCookie("MUSIC_U") !== null)) {
         request.params.cookie = "NMTID=00OqF1ULmfOTfxHZ00UolV4BKsAP8IAAAGMhukvUQ; _iuqxldmzr_=32; _ntes_nnid=41cbe3aaaeec09ad1a5bb11998b4e040,1703070478816; _ntes_nuid=41cbe3aaaeec09ad1a5bb11998b4e040; WEVNSM=1.0.0; WNMCID=zuyhwu.1703070479237.01.0; __snaker__id=AYWgoSaRFDF7t0Dg; WM_TID=3bTP5WvJRFpBEVFFUAeV3BCV3PVlb8hB; ntes_utid=tid._.R%252Bm9b6BXA%252FlEEkBRVVOEiATQyLBmXdQ8._.0; sDeviceId=YD-OZKXMbohkZNFRxAEFRfBktSfygA8OIMn; ntes_kaola_ad=1; gdxidpyhxdE=WENjVdEouynl2r%5ClMhaAXRS26a%2FE%2FL5KfGWi0jUO4Md%5CdnmVXePP3H%2FytCQCW%2FifoBtDaTQVAe%2BKGsry56i%5CrE%2FkJI2KVW8W4CyW%5CI4r%2BSeCECvwYHeu1P%5C6xdjHtNahnSTZ8CZbwE0fM0U0kVOEADVXrRYrb2ctKLuBnfYjOIWkxl4K%3A1703835812577; NTES_P_UTID=c3KfIV5qXOO60YX8CCq8BrPwe2ks6mNM|1703834920; P_INFO=pianfeng@126.com|1703834920|0|music|11&17|jis&1703424099&music#jis&321100#10#0#0|&0|music&cloudmusic&mail126|pianfeng@126.com; __csrf=6a8550e0430c6aecf2fbf0b29d699a83; __remember_me=true; MUSIC_U=00FCF267BD8E022A26EF03D8E4E096934CBC28B2DD60D9467BE4DA9276EDFFBD4581D6A7B570FF227902212983065E3176E5FAC356582116B1A71876E8C70240822F3A0FB6601EEFC0193E7F9FFE2A607B84F2DE76ED660D40B6A2A46BB6CEA396AF951F2685C83A8595FFD7CCF92D9E474F644D15E1D3E67324FCB0CC040E6BAF0FF1D9B162F618A2BD31633BDA1FC386C4F43C690CDCAAE48B0DC2F868934168FBEC8A0F3FCB1F11FFDD91FDB264DECAB0FB0997ADF574A3946B532A264B208CC337775FB35237E9F749E2E674AA43166F48B5464199359F6C3E1918B8FE9B178E9A9EEE66F565FF36400BFBE518174E4EE0238CE7F66B191E31FAE9C664AD5470919040FE1433B8A61E20B62CBAB9F52DE7F34C36252EAA3DC991842FC61EF803476EF0A4883583FDD7810C406ACB7BBAEE922E9110BA3C96E4BD060A3383740A89E5474047FFC4B98EEA60FCD720CA4FB6ABB4BCB455D793B4E53D9BB370B6; JSESSIONID-WYYY=N6CiVZZcJvxQW%5CnbjxIbrvfrlEqSaNHV7%5CH72gx8vDe9hwVTnjoavV3vko50jJkaZJ5T9b8ufCboNdgJ09wO%2BFVoY9B%2Fn3AscvF4RsCC2mIlZR%2F9YM9rikeUmgwHtB%2Fmawix6F0uc%5C9sfk2T7w9l%2BXhmgBr1ApSyu8w3sHvSPNx3Z3et%3A1703921256891; WM_NI=RRpi9XzAMf%2ByU%2BM4bCQz0Qb5DiFmB2yVHs1K4Vbe%2ByBl5l4OaWJzMwTmDWIy8tUr%2FELZOX9FjPOIKAv91GA4jaee7n%2BfF4Oa5vKejcuRONVr8gJv0XfEbgrb08RBxAyiVUk%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb6d5658faa85a9cc45a28a8bb";
      // request.params.cookie = `MUSIC_U=${getCookie("MUSIC_U")};`;
    }
    // 去除 cookie
    if (request.noCookie) {
      request.params.noCookie = false;
    }
    // 附加 realIP
    if (!checkPlatform.electron()) request.params.realIP = "116.25.146.177";
    // 发送请求
    return request;
  },
  (error) => {
    console.error("请求失败，请稍后重试");
    return Promise.reject(error);
  },
);

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    // 从错误对象中获取响应信息
    const response = error.response;
    // 断网处理
    if (!response) $canNotConnect(error);
    // 状态码处理
    switch (response?.status) {
      case 400:
        console.error("客户端错误：", response.status, response.statusText);
        // 执行客户端错误的处理逻辑
        break;
      case 401:
        console.error("未授权：", response.status, response.statusText);
        // 执行未授权的处理逻辑
        break;
      case 403:
        console.error("禁止访问：", response.status, response.statusText);
        // 执行禁止访问的处理逻辑
        break;
      case 404:
        console.error("未找到资源：", response.status, response.statusText);
        // 执行未找到资源的处理逻辑
        break;
      case 500:
        console.error("服务器错误：", response.status, response.statusText);
        // 执行服务器错误的处理逻辑
        break;
      default:
        // 处理其他状态码或错误条件
        console.error("未处理的错误：", error.message);
    }
    // 继续传递错误
    return Promise.reject(error);
  },
);

export default axios;
