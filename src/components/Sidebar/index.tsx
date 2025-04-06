import {
  CloseOutlined,
  CustomerServiceOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Button, Drawer } from "antd";
import classNames from "classnames/bind";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);
interface MenuItem {
  key: string;
  label: string;
  children?: MenuItem[];
  type?: "highlight" | "normal";
  expanded?: boolean;
}

export interface SidebarRef {
  showDrawer: () => void;
  closeDrawer: () => void;
}

const Sidebar = forwardRef<SidebarRef>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      key: "women",
      label: "Nữ",
      expanded: false,
      children: [
        { key: "women-tops", label: "Áo" },
        { key: "women-bottoms", label: "Quần" },
        { key: "women-dresses", label: "Váy đầm" },
      ],
    },
    {
      key: "men",
      label: "Nam",
      expanded: true,
      children: [
        { key: "men-tops", label: "Áo" },
        { key: "men-bottoms", label: "Quần" },
        { key: "men-accessories", label: "Phụ kiện" },
      ],
    },
    {
      key: "new-arrival",
      label: "NEW ARRIVAL",
      type: "highlight",
    },
    {
      key: "tops",
      label: "ÁO",
      expanded: false,
      children: [
        { key: "tops-tshirts", label: "Áo phông" },
        { key: "tops-shirts", label: "Áo sơ mi" },
        { key: "tops-sweaters", label: "Áo len" },
      ],
    },
    {
      key: "sale",
      label: "Săn DEAL giá cuối từ 200k",
      type: "highlight",
    },
    {
      key: "men-pants",
      label: "QUẦN NAM",
      expanded: false,
      children: [
        { key: "men-pants-jeans", label: "Quần jeans" },
        { key: "men-pants-shorts", label: "Quần short" },
        { key: "men-pants-khakis", label: "Quần kaki" },
      ],
    },
    {
      key: "super-deal",
      label: "SIÊU DEAL T4 - Sale upto 70%",
      type: "highlight",
      expanded: false,
      children: [
        { key: "super-deal-men", label: "Thời trang nam" },
        { key: "super-deal-women", label: "Thời trang nữ" },
      ],
    },
    {
      key: "accessories",
      label: "Bộ sưu tập",
      expanded: false,
      children: [
        { key: "accessories-summer", label: "Bộ sưu tập hè" },
        { key: "accessories-winter", label: "Bộ sưu tập đông" },
      ],
    },
    {
      key: "lifestyle",
      label: "LIFESTYLE",
    },
    {
      key: "about",
      label: "Về Chúng Tôi",
      expanded: false,
      children: [
        { key: "about-story", label: "Câu chuyện thương hiệu" },
        { key: "about-stores", label: "Cửa hàng" },
        { key: "about-contact", label: "Liên hệ" },
      ],
    },
  ]);
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const toggleExpand = (key: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.key === key ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
    closeDrawer,
  }));

  const renderMenu = () => {
    return menuItems.map((item) => {
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.key} className={cx("menu-item")}>
          <div
            className={`${cx("menu-header")} ${item.type === "highlight" ? cx("menu-hightlight") : ""}`}
          >
            <p className={cx("menu-label")}>{item.label}</p>
            {hasChildren && (
              <Button
                type="text"
                icon={item.expanded ? <MinusOutlined /> : <PlusOutlined />}
                onClick={() => toggleExpand(item.key)}
                className={cx("expand-button")}
              />
            )}
          </div>

          {hasChildren && item.expanded && (
            <div className={cx("sub-menu")}>
              {item.children?.map((child) => (
                <div key={child.key} className={cx("sub-menu-item")}>
                  {child.label}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cx("navigation-container")}>
      <Drawer
        title={null}
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={visible}
        closeIcon={<CloseOutlined className={cx("close-icon")} />}
        width={300}
        className={cx("navigation-drawer")}
      >
        <div className={cx("login-button")}>
          <Button type="primary" block>
            Đăng nhập
          </Button>
        </div>

        <div className={cx("menu-container")}>{renderMenu()}</div>

        <div className={cx("tab-bar")}>
          <div className={cx("tab-item")}>
            <SearchOutlined />
            <span>Tìm kiếm</span>
          </div>
          <div className={cx("tab-item")}>
            <UserOutlined />
            <span>Đăng nhập</span>
          </div>
          <div className={cx("tab-item")}>
            <CustomerServiceOutlined />
            <span>Trợ giúp</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
});

export default Sidebar;
