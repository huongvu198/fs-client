import { LoginOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import {
  hasAccessToken,
  removeAccessToken,
  removeLocalRefreshToken,
  removeLocalToken,
  removeRefreshToken,
} from "@config/accessToken";
import { Avatar, Dropdown, Space, type MenuProps } from "antd";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import SearchComponent from "@components/SearchComponent";
import CategoryWithDropdownComponent from "@components/CategoryWithDropdownComponent";
import Notification from "@components/NotificationComponent";
import CartExpand from "@components/CartExpandComponent";
import { useState } from "react";
import { UserOrders, ProfilePath } from "@config/routerConfig";
import ButtonComponent from "@components/ButtonComponent";
import { ICartResponse } from "interfaces/cart.interface";
interface Props {
  handleHiddenSideBar: () => void;
  handleShowSideBar: () => void;
}

const notifications = [
  { id: 1, message: "Bạn có đơn hàng mới!" },
  { id: 2, message: "Khuyến mãi đặc biệt hôm nay!" },
  { id: 3, message: "Sản phẩm yêu thích của bạn đã có hàng!" },
];

const cx = classNames.bind(styles);

export default function Nav({ handleShowSideBar }: Props) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ICartResponse>({
    id: "",
    items: [],
  });
  const Logout = () => {
    const handleLogout = () => {
      removeAccessToken();
      removeRefreshToken();
      removeLocalToken();
      removeLocalRefreshToken();
      navigate("/");
    };

    return (
      <div onClick={handleLogout}>
        <LoginOutlined style={{ marginRight: "10px" }} />
        <span>Logout</span>
      </div>
    );
  };
  const items: MenuProps["items"] = [
    {
      label: <Link to={ProfilePath}>Tài khoản của tôi</Link>,
      key: "0",
    },
    {
      label: <Link to={UserOrders}>Đơn mua</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <Logout />,
      key: "3",
    },
  ];

  const handleSearch = (value: string) => {
    console.log("Search: ", value);
  };
  const handleLogin = () => {
    navigate("login");
  };

  return (
    <div className={cx(styles["nav-wrapper"])}>
      <div className="nav-component">
        <div className="logo">
          <MenuOutlined
            className="btn-expaned-sp"
            onClick={handleShowSideBar}
          />
          <img src="https://cdn0424.cdn4s.com/media/bai%20viet/logo-social.png" />
        </div>
        <CategoryWithDropdownComponent />
        {/* Search */}
        <SearchComponent
          placeholder="Search for product..."
          onSearch={handleSearch}
        />
        <div className={cx("right-group-btn")}>
          {/* Cart */}
          <Space>
            <CartExpand cartItems={cartItems} setCartItems={setCartItems} />
          </Space>
          {/* Notification */}
          <Space className={cx("notification-component")}>
            <Notification notifications={notifications} />
          </Space>
          {hasAccessToken() ? (
            <Dropdown
              className="drop-down-info"
              menu={{ items }}
              trigger={["click"]}
            >
              <Space>
                <Avatar src="" icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          ) : (
            <ButtonComponent
              className={cx("button-login")}
              type="primary"
              onClick={handleLogin}
            >
              Đăng Nhập
            </ButtonComponent>
          )}
        </div>
      </div>
    </div>
  );
}
