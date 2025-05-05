import BreadcrumbComponent from "@components/BreadCrumbComponent";
import { useLocation, useNavigate } from "react-router-dom";
import MenuComponent from "@components/MenuComponent";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ButtonComponent from "@components/ButtonComponent";
import ProductSection from "@components/ProductCardComponent";
import PaginationComponent from "@components/PaginationComponent";

const cx = classNames.bind(styles);

const breadCrumbItems = ["Nữ", "Áo", "Áo Thun"];

const menuItems = [
  {
    key: "/",
    label: "Category",
    children: [
      { key: "/settings/account", label: "Account", path: "" },
      {
        key: "/settings/security",
        label: "Security",
        path: "",
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    children: [
      {
        key: "/settings/account",
        label: (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <ButtonComponent className={cx("size-button-menu")}>
              S
            </ButtonComponent>
            <ButtonComponent className={cx("size-button-menu")}>
              M
            </ButtonComponent>
            <ButtonComponent className={cx("size-button-menu")}>
              L
            </ButtonComponent>
            <ButtonComponent className={cx("size-button-menu")}>
              4XL
            </ButtonComponent>
            <ButtonComponent className={cx("size-button-menu")}>
              4XL
            </ButtonComponent>
            <ButtonComponent className={cx("size-button-menu")}>
              4XL
            </ButtonComponent>
          </div>
        ),
        path: "/settings/account",
      },
    ],
  },
  {
    key: "/documents",
    label: "Documents",
    path: "/documents",
    children: [
      {
        key: "/settings/security",
        label: "Security",
        path: "",
      },
    ],
  },
];

const listProducts =[
  {
    id: "prod-1",
    name: "Áo Thun Nam",
    price: 200000,
    description: "Áo thun nam chất lượng cao",
    isActive: true,
    isArchived: false,
    discount: 10,
    totalQuantity: 100,
    totalSoldQuantity: 20,
    totalInventory: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    segment: {
      id: "seg-1",
      name: "Thời Trang Nam",
      slug: "thoi-trang-nam",
      category: {
        id: "cat-1",
        name: "Thời Trang",
        cateSlug: "thoi-trang",
        subCategory: {
          id: "subcat-1",
          name: "Áo",
          subCateSlug: "ao",
        },
      },
    },
    variants: [
      {
        id: "var-1",
        color: "Đen",
        isActive: true,
        sizes: [
          { id: "size-1", size: "M", quantity: 10, isActive: true },
          { id: "size-2", size: "L", quantity: 5, isActive: true },
        ],
        images: [
          { id: "img-1", url: "https://example.com/ao-den-1.jpg" },
          { id: "img-2", url: "https://example.com/ao-den-2.jpg" },
        ],
      },
      {
        id: "var-2",
        color: "Trắng",
        isActive: true,
        sizes: [
          { id: "size-3", size: "M", quantity: 15, isActive: true },
          { id: "size-4", size: "L", quantity: 8, isActive: true },
        ],
        images: [
          { id: "img-3", url: "https://example.com/ao-trang-1.jpg" },
          { id: "img-4", url: "https://example.com/ao-trang-2.jpg" },
        ],
      },
    ],
  },
  // Có thể thêm nhiều sản phẩm tương tự nếu bạn muốn
];

const getSelectedKey = (pathname: string) => {
  const matchedItem = menuItems.find((item) =>
    item.children
      ? item.children.some((child) => child.path === pathname)
      : item.path === pathname
  );
  return matchedItem ? matchedItem.key : "";
};

const handleChange = (page: number, pageSize?: number) => {
  console.log(`Page changed to: ${page}, Page size: ${pageSize}`);
};

const ListProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = getSelectedKey(location.pathname);
  return (
    <>
      <div className={cx("list-product-container")}>
        <BreadcrumbComponent items={breadCrumbItems} />
        <section className={cx("section-list-product")}>
          <div className={cx("menu-container")}>
            <MenuComponent items={menuItems} selectedKey={selectedKey} />
            <div className={cx("filter-button-container")}>
              <ButtonComponent className={cx("menu-clear-filter-button")}>
                CLEAR
              </ButtonComponent>
              <ButtonComponent className={cx("menu-filter-button")}>
                FILTER
              </ButtonComponent>
            </div>
          </div>
          <div className={cx("content-container")}>
            <h1>Category Name</h1>
            <div className={cx("product-card-container")}>
              <ProductSection
                justifyContent="flex-start"
                isViewAll={false}
                isSlider={false}
                products={listProducts}
                navigate={navigate}
              />
            </div>
            <div className={cx("pagination-container")}>
              <PaginationComponent
                pageSize={5}
                onPageChange={handleChange}
                totalItems={listProducts.length}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ListProduct;
