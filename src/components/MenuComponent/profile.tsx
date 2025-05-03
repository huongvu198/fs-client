import React from "react";
import {
  EnvironmentOutlined,
  GiftOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ProfilePath,
  UserAddressPath,
  UserOrders,
  UserPath,
  UserVouchers,
} from "@config/routerConfig";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: ProfilePath,
    label: "Tài khoản của tôi",
    icon: <UserOutlined />,
  },
  {
    key: UserAddressPath,
    label: "Địa chỉ nhận hàng",
    icon: <EnvironmentOutlined />,
  },
  {
    key: UserOrders,
    label: "Đơn hàng của tôi",
    icon: <ShoppingOutlined />,
  },
  {
    key: UserVouchers,
    label: "Kho Voucher",
    icon: <GiftOutlined />,
  },
];

const UserMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const selectedKey =
    [ProfilePath, UserAddressPath, UserOrders, UserVouchers].find((path) =>
      currentPath.startsWith(path)
    ) || UserPath;

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Menu
      theme="light"
      onClick={onClick}
      style={{ width: 256, textAlign: "left" }}
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["user"]}
      mode="inline"
      items={items}
    />
  );
};

export default UserMenu;
