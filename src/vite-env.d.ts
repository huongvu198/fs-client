/// <reference types="vite/client" />

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.scss";
declare module "*.css";
declare module "*.ts";
