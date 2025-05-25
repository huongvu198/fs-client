import {
  CheckCircleOutlined,
  DashOutlined,
  FormOutlined,
  ProfileOutlined,
  TableOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { FlagEN, FlagVietNam } from "@components/Icon";
import { JSX } from "react";

export const INTERNAL_SERVER_ERROR = 500;
export const NOT_FOUND = 404;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const GATEWAY_TIME_OUT = 504;
export const REQUEST_SUCCESS = 200;
export const BAD_REQUEST = 400;

export const WIDTH_SIDE_BAR_PC = 256;
export const WIDTH_SIDE_BAR_SP = 80;
export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const BREAKPOINT_SCREEN = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export const ICONS_NAV: Record<string, JSX.Element> = {
  admin: <WarningOutlined />,
  dashboard: <DashOutlined />,
  ticket: <FormOutlined />,
  "ticket-approval": <TableOutlined />,
  "ticket-view": <ProfileOutlined />,
  "ticket-team": <CheckCircleOutlined />,
};

export type Language = "vn" | "en";

export const OPTION_LANGUAGE = [
  {
    label: (
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <FlagVietNam /> <>🇻🇳 VN</>
      </div>
    ),
    value: "vn",
  },
  {
    label: (
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <FlagEN /> <>🇬🇧 EN</>
      </div>
    ),
    value: "en",
  },
];

export const MENU_TYPE = {
  USER: "user",
  ADMIN: "admin",
};
