import { hasAccessToken } from "@config/accessToken";

export const checkAuthentication = () => {
  if (!hasAccessToken()) {
    window.location.href = "/login";
  }
};

export const checkLogin = () => {
  if (hasAccessToken()) {
    window.history.back();
  }
};
