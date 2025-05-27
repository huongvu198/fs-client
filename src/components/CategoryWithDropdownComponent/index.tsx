import { Dropdown, Flex, Tree } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { NewPath, ProductsQueryPath } from "@config/routerConfig";
import { getCategoriesRedux } from "@redux/appSlice";
import { useState } from "react";

const cx = classNames.bind(styles);

const menuItems = [
  {
    key: "danh-muc",
    type: "dropdown",
    label: "DANH MỤC",
  },
  {
    key: "tin-tuc",
    type: "link",
    label: "TIN TỨC",
    path: NewPath,
  },
];

const CategoryWithDropdownComponent = () => {
  const navigate = useNavigate();
  const categoriesRedux = useSelector(getCategoriesRedux);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const NodeTitle = ({
    label,
    nodeKey,
  }: {
    label: string;
    nodeKey: string;
  }) => {
    const handleClick = () => {
      navigate(ProductsQueryPath({ search: nodeKey }));
      setDropdownOpen(false);
    };

    return (
      <div onClick={handleClick} className={cx("nodeTitle")}>
        {label}
      </div>
    );
  };

  return (
    <div className={cx("category-container")}>
      {menuItems.map((item) => {
        if (item.type === "dropdown") {
          return (
            <Dropdown
              key={item.key}
              trigger={["hover"]}
              placement="bottom"
              open={dropdownOpen}
              onOpenChange={(open) => setDropdownOpen(open)}
              overlay={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    minWidth: "fit-content",
                  }}
                >
                  <style>
                    {`
                    .ant-tree .ant-tree-switcher {
                      width: 0px !important;
                    }
                    .ant-tree .ant-tree-treenode {
                       background: none !important;
                    }
                    .ant-tree .ant-tree-treenode:hover {
                      background-color: transparent !important;
                    }
                    .ant-tree .ant-tree-node-content-wrapper {
                      padding-inline: 0px !important;
                    }
                    .ant-tree .ant-tree-node-content-wrapper:hover {
                      background: none !important;
                      color: red !important;
                    }
                  `}
                  </style>
                  <div>
                    <Flex vertical gap="middle" style={{ width: "100vw" }}>
                      <Flex wrap="wrap" gap={8}>
                        {categoriesRedux.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              flex: "0 0 calc((100% - 5 * 8px) / 6)",
                              minWidth: 120,
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                              <NodeTitle
                                label={item.name.toUpperCase()}
                                nodeKey={item.id}
                              />
                            </div>
                            <Tree
                              showLine={false}
                              showIcon={false}
                              switcherIcon={null}
                              defaultExpandAll
                              treeData={
                                item.children?.map((child) => ({
                                  key: child.id,
                                  title: (
                                    <NodeTitle
                                      label={child.name.toUpperCase()}
                                      nodeKey={child.id}
                                    />
                                  ),
                                })) ?? []
                              }
                              selectable={false}
                            />
                          </div>
                        ))}
                      </Flex>
                    </Flex>
                  </div>
                </div>
              }
              overlayStyle={{ padding: 0 }}
            >
              <div className={cx("category-item")}>{item.label}</div>
            </Dropdown>
          );
        }

        if (item.type === "link") {
          return (
            <Link
              key={item.key}
              to={item.path!}
              className={cx("category-item")}
              style={{ textDecoration: "none", color: "#000000" }}
            >
              {item.label}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
};

export default CategoryWithDropdownComponent;
