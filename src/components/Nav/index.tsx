import {
  LoginOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { removeAccessToken } from "@config/accessToken";
import { getLocale, setLocale } from "@config/locale";
import { Language, OPTION_LANGUAGE } from "@constants/const";
import { Avatar, Dropdown, Select, Space, type MenuProps } from "antd";
import classNames from "classnames/bind";
import { changeLanguage } from "i18next";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import useNotification from "@hooks/useNotification";
import SearchComponent from "@components/SearchComponent";
import CategoryWithDropdownComponent from "@components/CategoryWithDropdownComponent";
import Notification from "@components/NotificationComponent";
import CartExpand from "@components/CartExpandComponent";
import { useState } from "react";
interface Props {
  handleHiddenSideBar: () => void;
  handleShowSideBar: () => void;
}

const Logout = () => {
  const { errorMessage } = useNotification();
  const handleLogout = () => {
    removeAccessToken();
    errorMessage({ description: "Đã logout!!!" });
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
      <a href="https://www.youtube.com/watch?v=u1d7MWpBb8M">Change Password</a>
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

const notifications = [
  { id: 1, message: "Bạn có đơn hàng mới!" },
  { id: 2, message: "Khuyến mãi đặc biệt hôm nay!" },
  { id: 3, message: "Sản phẩm yêu thích của bạn đã có hàng!" },
];

const cx = classNames.bind(styles);

export default function Nav({
  handleShowSideBar,
}: Props) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Elegant Silk Blouse",
      description: "Áo sơ mi lụa",
      color: "Hồng cánh sen",
      size: "M",
      price: 145,
      quantity: 1,
      image:
        "https://s3-alpha-sig.figma.com/img/f04a/017d/b094f9a20c2328f54a31b153619784f3?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tYJyKcr6xdA9nfd6RDxQEkku5PtvQ44DC1rA7dwrW3GUl-EpC9McVqRsKjiVovY6m1etnJGPlnYUsjSQl6K7CfxNHuKgsP~vDCLIDwkVtoPcOZwS3u7dpuwq8RvZhyTRBl5jumVhqOaXtmr4B2RIA0zhqvkIt3RmW8GH7bbVr06U9KfEmRLiQSeOwX2JEjpdLlCY-~3IUer-kxqkJ3ZmHhgFv86mrEZV4C-NK~Ni0lOrKW0YDgHi3Qh4MiBRsudicoCN1p-HJbjvqrreGpZ59Ziazrwqmpv7-rgiW67DqXP9~VMlYUWPd77TN0bTH-IIKWj4N4uexf5eto-xVaWHZA__",
    },
  ]);

  const handleChangeLanguage = (e: Language) => {
    setLocale(e);
    changeLanguage(e);
    navigate(0);
  };
  const currentLanguage = getLocale() as Language;

  const handleSearch = (value: string) => {
    console.log("Search: ", value);
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
          <Dropdown
            className="drop-down-info"
            menu={{ items }}
            trigger={["click"]}
          >
            <Space>
              <Avatar src="" icon={<UserOutlined />} />
            </Space>
          </Dropdown>
          <Select
            defaultValue={currentLanguage}
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
            options={OPTION_LANGUAGE}
          />
        </div>
      </div>
    </div>
  );
}
