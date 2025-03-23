import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { DATA_SIDEBAR } from "@constants/const";

const cx = classNames.bind(styles);

const CategoryWithDropdownComponent = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleNavigate = (slug: string) => {
    if (slug) navigate(slug);
  };

  const menu = (
    <Menu>
      {DATA_SIDEBAR.find((cate) => cate.key === "shop")?.subItems?.map(
        (item) => (
          <Menu.Item key={item.key} onClick={() => handleNavigate(item.slug)}>
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );

  return (
    <div className={cx("category-container")}>
      {DATA_SIDEBAR.map((item) =>
        item.hasDropdown ? (
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onOpenChange={setOpenDropdown}
            key={item.key}
          >
            <Space className={cx("category-item", { active: openDropdown })}>
              {item.label} <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <div
            key={item.key}
            className={cx("category-item")}
            onClick={() => handleNavigate(item.slug)}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
};

export default CategoryWithDropdownComponent;
