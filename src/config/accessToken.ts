import Cookies from "js-cookie";

const ACCESS_TOKEN = "ACCESS_TOKEN";
const REFRESH_TOKEN = "REFRESH_TOKEN";

export const setAccessToken = (token: string) => Cookies.set(ACCESS_TOKEN, token);
export const getAccessToken = () => Cookies.get(ACCESS_TOKEN);

export const setRefreshToken = (token: string) => Cookies.set(REFRESH_TOKEN, token);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN);

export const removeAccessToken = () => Cookies.remove(ACCESS_TOKEN);
export const removeRefreshToken = () => Cookies.remove(REFRESH_TOKEN);

export const hasAccessToken = () => !!Cookies.get(ACCESS_TOKEN);
export const hasRefreshToken = () => !!Cookies.get(REFRESH_TOKEN);


// Localstorage

export const setLocalToken = (token: string) => localStorage.setItem(ACCESS_TOKEN, token);
export const getLocalToken = () => localStorage.getItem(ACCESS_TOKEN);

export const setLocalRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN, token);
export const getLocalRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const removeLocalToken = () => localStorage.removeItem(ACCESS_TOKEN);
export const removeLocalRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN);

export const hasLocalAccessToken = () => !!localStorage.getItem(ACCESS_TOKEN);
export const hasLocalRefreshToken = () => !!localStorage.getItem(REFRESH_TOKEN);