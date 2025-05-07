import { FORBIDDEN, UNAUTHORIZED } from "@constants/const";
import { cleanAndConvertToCamelCase, convertToCamelCase } from "@utils/index";
import axios from "axios";
import { getAccessToken, getLocalRefreshToken, getRefreshToken, removeAccessToken } from "./accessToken";
import { config } from "./appConfig";

const { baseURL } = config.server;

export const authAxios = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const unauthAxios = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const refreshAuthAxios = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authAxios.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (config.params) {
      config.params = cleanAndConvertToCamelCase(config.params);
    }

    if (config.data) {
      config.data = cleanAndConvertToCamelCase(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

refreshAuthAxios.interceptors.request.use(
  (config) => {
    const refreshToken = getRefreshToken() || getLocalRefreshToken();
    if (refreshToken) {
      config.headers["Authorization"] = `Bearer ${refreshToken}`;
    }

    if (config.params) {
      config.params = cleanAndConvertToCamelCase(config.params);
    }

    if (config.data) {
      config.data = cleanAndConvertToCamelCase(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => {
    response.data = convertToCamelCase(response.data);
    return response;
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

unauthAxios.interceptors.request.use(
  (config) => {
    if (config.params) {
      config.params = cleanAndConvertToCamelCase(config.params);
    }

    if (config.data) {
      config.data = cleanAndConvertToCamelCase(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

unauthAxios.interceptors.response.use(
  (response) => {
    response.data = convertToCamelCase(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
