import {
  CloseOutlined,
  LoginOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
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
interface Props {
  isOpenSideBar: boolean;
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
  isOpenSideBar,
  handleHiddenSideBar,
  handleShowSideBar,
}: Props) {
  const navigate = useNavigate();

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
          {isOpenSideBar ? (
            <CloseOutlined
              className="btn-expaned-sp"
              onClick={handleHiddenSideBar}
            />
          ) : (
            <MenuOutlined
              className="btn-expaned-sp"
              onClick={handleShowSideBar}
            />
          )}
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
            <ShoppingCartOutlined className={cx("shopping-cart-component")} />
          </Space>
          {/* Notification */}
          <Space className={cx("notification-component")}>
            <Notification notifications={notifications} />
          </Space>
          <Dropdown
            className="drop-down-info"
            menu={{ items: [] }}
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
