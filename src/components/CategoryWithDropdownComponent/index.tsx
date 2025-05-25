import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import type { MenuProps } from "antd";
import { useSelector } from "react-redux";
import { getListSegment } from "@redux/segmentSlice";
import { ISegment } from "interfaces/segment.interface";

const cx = classNames.bind(styles);

type RecursiveMenuItem = {
  key: string;
  label: string;
  slug?: string;
  disabled?: boolean;
  type?: "item" | "submenu";
  children?: RecursiveMenuItem[];
};

const CategoryWithDropdownComponent = () => {
  const navigate = useNavigate();
  const segmentRedux = useSelector(getListSegment);

  function transformData(data: ISegment[]): RecursiveMenuItem[] {
    const activeSorted = data
      .filter((segment) => segment.isActive)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const danhMuc: RecursiveMenuItem = {
      key: "danh-muc",
      label: "Danh mục",
      type: "submenu",
      children: [],
    };

    const staticItems: RecursiveMenuItem[] = [
      {
        key: "static-news",
        label: "Tin tức",
        slug: "/news",
        type: "item",
      },
    ];

    for (const segment of activeSorted) {
      const segmentNode: RecursiveMenuItem = {
        key: segment.id,
        label: segment.name,
        slug: segment.slug,
        type: "submenu",
        children: [],
      };

      for (const category of segment.categories || []) {
        if (!category.isActive) continue;

        const categoryNode: RecursiveMenuItem = {
          key: category.id,
          label: category.name,
          slug: category.cateSlug,
          type: "submenu",
          children: [],
        };

        for (const subcategory of category.subCategories || []) {
          if (!subcategory.isActive) continue;

          const subcategoryNode: RecursiveMenuItem = {
            key: subcategory.id,
            label: subcategory.name,
            slug: subcategory.subCateSlug,
            type: "item",
          };

          categoryNode.children?.push(subcategoryNode);
        }

        // Nếu categoryNode không có con thì là item
        if (!categoryNode.children || categoryNode.children.length === 0) {
          categoryNode.type = "item";
        }

        segmentNode.children?.push(categoryNode);
      }

      // Nếu segmentNode không có con thì là item
      if (!segmentNode.children || segmentNode.children.length === 0) {
        segmentNode.type = "item";
      }

      danhMuc.children?.push(segmentNode);
    }

    return [danhMuc, ...staticItems];
  }

  const DATA_SIDEBAR = transformData(segmentRedux);

  // Chuyển đổi thành menu items hợp lệ của antd (loại bỏ slug)
  const convertMenuItems = (
    items: RecursiveMenuItem[]
  ): NonNullable<MenuProps["items"]> => {
    return items.map((item) => {
      if (item.type === "submenu") {
        return {
          key: item.key,
          label: item.label,
          disabled: item.disabled,
          type: item.type,
          children: convertMenuItems(item.children || []), // luôn có children cho submenu
        };
      }
      // For "item", không có children
      return {
        key: item.key,
        label: item.label,
        disabled: item.disabled,
        type: item.type,
      };
    });
  };

  // Tìm item theo key để lấy slug
  const findItemByKey = (
    items: RecursiveMenuItem[],
    key: string
  ): RecursiveMenuItem | undefined => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Xử lý click menu: tìm slug và navigate
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const clickedItem = findItemByKey(DATA_SIDEBAR, e.key);
    if (clickedItem?.slug) {
      navigate(clickedItem.slug);
    }
  };

  return (
    <div className={cx("category-container")}>
      {DATA_SIDEBAR.map((item) => {
        const isDropdown = !!item.children && item.children.length > 0;

        if (isDropdown) {
          const menuItems: MenuProps["items"] = convertMenuItems(
            item.children || []
          );

          return (
            <Dropdown
              key={item.key}
              menu={{ items: menuItems, onClick: handleMenuClick }}
              trigger={["hover"]}
              overlayStyle={{ minWidth: 200 }}
            >
              <div
                className={cx("category-item")}
                style={{ cursor: "default" }}
              >
                {/* Click vào label vẫn navigate được, nhưng stopPropagation để không ảnh hưởng dropdown mở */}
                <span
                  className={cx("category-label")}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.slug) {
                      navigate(item.slug);
                    }
                  }}
                  style={{
                    cursor: item.slug ? "pointer" : "default",
                    userSelect: "none",
                  }}
                >
                  {typeof item.label === "string"
                    ? item.label.toUpperCase()
                    : item.label}
                </span>
                <DownOutlined style={{ marginLeft: 4 }} />
              </div>
            </Dropdown>
          );
        }

        return (
          <div
            key={item.key}
            className={cx("category-item")}
            onClick={() => navigate(item.slug || "#")}
            style={{ cursor: "pointer" }}
          >
            {typeof item.label === "string"
              ? item.label.toUpperCase()
              : item.label}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryWithDropdownComponent;
