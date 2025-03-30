import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface MenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

interface CustomMenuProps {
  items: MenuItem[];
  selectedKey: string;
}

const MenuComponent = ({ items, selectedKey }: CustomMenuProps) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      theme="light"
      expandIcon={({ isOpen }) =>
        isOpen ? <MinusOutlined /> : <PlusOutlined />
      }
      className={cx("menu-container")}
    >
      {items.map((item) =>
        item.children ? (
          <Menu.SubMenu
            key={item.key}
            icon={item.icon}
            title={item.label}
            className={cx("submenu-container")}
            expandIcon={({ isOpen }) =>
              isOpen ? <MinusOutlined /> : <PlusOutlined />
            }
          >
            {item.children.map((child) =>
              child.children ? (
                <Menu.SubMenu
                  key={child.key}
                  icon={child.icon}
                  title={child.label}
                  expandIcon={({ isOpen }) =>
                    isOpen ? <MinusOutlined /> : <PlusOutlined />
                  }
                  className={cx("submenu-container")}
                >
                  {child.children.map((subChild) => (
                    <Menu.Item key={subChild.key} className={cx("menu-item-container")}>
                      <Link to={subChild.path || "#"} className={cx("menu-item-label")}>{subChild.label}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={child.key} icon={child.icon} className={cx("menu-item-container")}>
                  <Link to={child.path || "#"} className={cx("menu-item-label")}>{child.label}</Link>
                </Menu.Item>
              )
            )}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.key} icon={item.icon} className={cx("menu-item-container")}>
            <Link to={item.path || "#"} className={cx("menu-item-label")}>{item.label} </Link>
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default MenuComponent;
