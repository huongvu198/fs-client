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
import CartExpand from "@components/CartExpandComponent";
import { useEffect, useState } from "react";
import ButtonComponent from "@components/ButtonComponent";
import { ICartResponse } from "interfaces/cart.interface";
import { useCartContext } from "contexts/cartContext";
import {
  LoginPath,
  ProductsQueryPath,
  ProfilePath,
  UserOrders,
} from "@config/routerConfig";

import { useAuthContext } from "contexts/authContext";
import { removeCartList, removeTempCart } from "shared/localStoreage";
interface Props {
  handleHiddenSideBar: () => void;
  handleShowSideBar: () => void;
}

const cx = classNames.bind(styles);

export default function Nav({ handleShowSideBar }: Props) {
  const navigate = useNavigate();
  const [, setCartItems] = useState<ICartResponse | null>(null);
  const { setCart } = useCartContext();
  const { isAuthenticated, logout } = useAuthContext();

  const Logout = () => {
    const handleLogout = () => {
      removeAccessToken();
      removeRefreshToken();
      removeLocalToken();
      removeLocalRefreshToken();
      removeTempCart();
      removeCartList();
      setCart({ id: "", items: [] });
      logout();
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
    const path = ProductsQueryPath({ search: value });
    navigate(path);
  };

  const handleLogin = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    navigate(LoginPath);
  };

  useEffect(() => {
    const loadCart = () => {
      const localStorageKey = hasAccessToken() ? "cartList" : "tempCart";
      const localCart = localStorage.getItem(localStorageKey);
      if (localCart) {
        try {
          const parsedCart: ICartResponse = JSON.parse(localCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
        }
      }
    };

    loadCart();
  }, []);

  return (
    <div className={cx(styles["nav-wrapper"])}>
      <div className="nav-component">
        <div className="logo">
          <MenuOutlined
            className="btn-expaned-sp"
            onClick={handleShowSideBar}
          />
          <span
            className="brand-name"
            style={{
              marginLeft: "10px",
              fontSize: "28px",
              fontWeight: 600,
              fontFamily: "'Lobster', cursive",
              color: "#d1567c",
              cursor: "pointer",
              userSelect: "none",
              letterSpacing: "1.5px",
            }}
            onClick={() => navigate("/")}
          >
            Pinky
          </span>
        </div>
        <CategoryWithDropdownComponent />
        {/* Search */}
        <SearchComponent
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleSearch}
        />
        <div className={cx("right-group-btn")}>
          {/* Cart */}
          <Space>
            <CartExpand />
          </Space>
          {/* Notification */}
          {/* <Space className={cx("notification-component")}>
            <Notification notifications={notifications} />
          </Space> */}
          {isAuthenticated ? (
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
              htmlType="button"
              className={cx("button-login")}
              type="primary"
              onClick={() => handleLogin()}
            >
              Đăng Nhập
            </ButtonComponent>
          )}
        </div>
      </div>
    </div>
  );
}
