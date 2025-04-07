import { FORBIDDEN, UNAUTHORIZED } from "@constants/const";
import { cleanAndConvertToCamelCase, convertToCamelCase } from "@utils/index";
import axios from "axios";
import { getAccessToken, removeAccessToken } from "./accessToken";

const request = axios.create({
  baseURL: import.meta.env.BACKEND_API,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    //use METHOD GET
    if (config.params) {
      config.params = cleanAndConvertToCamelCase(config.params);
    }
    //use METHOD POST,PUT,PATCHPATCH
    if (config.data) {
      config.data = cleanAndConvertToCamelCase(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.request.use(
  (response) => {
    response.data = convertToCamelCase(response.data);
    return response.data;
  },
  (error) => {
    switch (error?.response?.status) {
      case UNAUTHORIZED:
        removeAccessToken();
        window.location.href = "/";
        break;
      case FORBIDDEN:
        window.location.href = "/forbidden";
        break;
    }

    return Promise.reject(error);
  }
);

export default request;
