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
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import SearchComponent from "@components/SearchComponent";
import CategoryWithDropdownComponent from "@components/CategoryWithDropdownComponent";
import Notification from "@components/NotificationComponent";
import CartExpand from "@components/CartExpandComponent";
import { useEffect, useState } from "react";
import ButtonComponent from "@components/ButtonComponent";
import { ICartResponse } from "interfaces/cart.interface";
import { useCartContext } from "contexts/cartContext";

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
  const [, setCartItems] = useState<ICartResponse | null>(null);
  const { setCart } = useCartContext(); 
  const Logout = () => {
    const handleLogout = () => {
      removeAccessToken();
      removeRefreshToken();
      removeLocalToken();
      removeLocalRefreshToken();
      localStorage.removeItem("tempCart"); 
      localStorage.removeItem("cartList");
      setCart({ id: "", items: [] });
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
      label: (
        <a href="https://www.youtube.com/watch?v=5z0u0BfPJ8o&list=RDxJ7EF7XweiA&index=5">
          Edit Profile
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a href="https://www.youtube.com/watch?v=u1d7MWpBb8M">
          Change Password
        </a>
      ),
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
  const handleLogin = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    navigate("/login");
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
          <img
            src="https://cdn0424.cdn4s.com/media/bai%20viet/logo-social.png"
            alt="logo"
          />
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
            <CartExpand />
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
