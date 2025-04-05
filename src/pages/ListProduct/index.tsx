import Footer from "@components/FooterComponent";
import BreadcrumbComponent from "@components/BreadCrumbComponent";
import { useLocation } from "react-router-dom";
import MenuComponent from "@components/MenuComponent";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ButtonComponent from "@components/ButtonComponent";
import ProductSection from "@components/ProductCardComponent";
import PaginationComponent from "@components/PaginationComponent";

const cx = classNames.bind(styles);

const breadCrumbItems = [
  "Nữ",
  "Áo",
  "Áo Thun"
];

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
      { key: "/settings/account", label: (
        <div style={{display: 'flex', flexWrap:'wrap'}}>
        <ButtonComponent className={cx("size-button-menu")}>S</ButtonComponent>
        <ButtonComponent className={cx("size-button-menu")}>M</ButtonComponent>
        <ButtonComponent className={cx("size-button-menu")}>L</ButtonComponent>
        <ButtonComponent className={cx("size-button-menu")}>4XL</ButtonComponent>
        <ButtonComponent className={cx("size-button-menu")}>4XL</ButtonComponent>
        <ButtonComponent className={cx("size-button-menu")}>4XL</ButtonComponent>
        </div>
      ), path: "/settings/account" },
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
    ]
  },
];

const listProducts = [
  { id: '6', name: 'Vertical Striped Shirt', image: 'https://s3-alpha-sig.figma.com/img/e01f/5d3c/d9029bd465a4c7158689ab1619693014?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=B23-uwOo6CzseOcW7KO28l1WY1fLHrha87AntSWV0haB94isI2TVsp7V7uhd80pGFaivJ5ix0A~41KyVUTGOJvQ3fWNF8ALLA1SYtRwPtOTk5Jh~yu57NU84Ajv4avbK~A7~QBIlwEQEgJr3RO7ipjbArTZAM7w1JVSnwRa2qTUGalwhla3Ny4L7ZUnCzxWAstTTn2d2YAv-14UkeLnIfpjXahx6cFuthDPtgHOMEsJ357-PrthgWzN6PG6W9oEEtdFl1M7TyWZJghOs~lWtKOnY9itYzoLIre9c4GaE-L3k4oJOhY9MQtzbVVAOFhVb21~PkF9z48rcaXKP9A4FcA__', rating: 4.0, reviews: 120, price: 212, originalPrice: 252, discount: 20 },
  { id: '7', name: 'Courage Graphic T-shirt', image: 'https://s3-alpha-sig.figma.com/img/5723/4b01/d5fcac5632cf6823570ca2d1d53d7d73?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bXKB9O8yd~ROXrmtzZrNpKqpUyh2uN1qAneFc~KS7WKwQe08pafvyNxc~cQlswu~922WuX3qagdPjUlDKy552sLjbaykmDUQ0tLbaQZKkggzVv2APkm1EvbUS~~andI8wGeS2y7tX2zwp5uQQ63R6W7yDtYEZkDr8m6HoeTNIWPoDo8o-5k2VDFIRRMk-BR62YZ~2pHLqwgvR0T4RtWNJnRpB8V-qSshd7QEc2Je-jBz9n9tmOqOGonCtqsYaUEeLNdjyeocKv1NVgiHGI9zcFfAdlcaO-KRnkzwesJ7hys9ciSGHVEYZfPF~8mbcQzY2FfgQoaIbvSGGsDcv1ZP8g__', rating: 4.0, reviews: 140, price: 145 },
  { id: '8', name: 'Loose Fit Bermuda Shorts', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 3.0, reviews: 105, price: 80 },
  { id: '9', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/f180/c768/08e2ff8a46be56aa933f031aed3abe75?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IqhHYK5T00XpEyjhQRHq~AHayoF26k5KPkWGMAOipQxUC-2eCkhs6asCJCruPvXs48wH0rIZfR~3vvcics-1nUvEuxWA6-FeYv6IfM52xHwFw8TZHI21e6hSMFOHZeUoohRK5EW8u04uzoIhpRz96xA-gijmpzoE4UtIyO1nIRIDlO~XhBqTXlau7TDNJO1FE3sepKyZPIeYSBXbjWzHAcrsYDeUjHYTqBoKNqv8Fgjf6zwTRnsFuzxoErZvazsTFZupqUY96LpUGA0nLsWHs-tZaAS8n5SSg99h7hWhlcqihnKDRm2MR0nUyq3coyYgLyb-p8fWcZo97VnycI~pXg__', rating: 4.5, reviews: 458, price: 210 },
  { id: '10', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 4.5, reviews: 458, price: 210 },
  { id: '10', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 4.5, reviews: 458, price: 210 },
  { id: '10', name: 'Faded Skinny Jeans', image: 'https://s3-alpha-sig.figma.com/img/8951/5d71/4a66d9ca1401101dee4cc689f8bb5ad2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QC520I9tQO5CToJRQieMD8oM2jsUM-cNUiBxap3ptY6YPkCCwugBv8HHkYGxnWItN7~97Y4rmZqcwa05H8QggaL0JCZChHfn9awRq~fIERiJdm5nMB0KPqewrPakCAxCOcTi~HfnNZqeG0JegAd9DP6uaJKANupSImAweyTevwnaKK2QlFjK9nFOZ57kmdMZrJPA3z4WOs~f5FHYW3KrvRE9fSTBRUWNu6TdC3gbPO43LZkzHncjTEyek1YfnqGFmykx-FdKRMNUX1G8-ExOd43qxHrN0O99qYeGbF8xs4vXTH0Y~lGj3Yc8zKIhBqCKi1F54oc98TjeO-8ePx9yxg__', rating: 4.5, reviews: 458, price: 210 },
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
  const selectedKey = getSelectedKey(location.pathname);
  return (
    <>
      <div className={cx("list-product-container")}>
        <BreadcrumbComponent items={breadCrumbItems}/>
        <section className={cx("section-list-product")}>
          <div className={cx("menu-container")}>
            <MenuComponent items={menuItems} selectedKey={selectedKey} />
            <div className={cx("filter-button-container")}>
            <ButtonComponent className={cx("menu-clear-filter-button")}>CLEAR</ButtonComponent>
            <ButtonComponent className={cx("menu-filter-button")}>FILTER</ButtonComponent>
            </div>
          </div>
          <div className={cx("content-container")}>
            <h1>Category Name</h1>
            <div className={cx("product-card-container")}> 
                <ProductSection isViewAll={false} isSlider={false} products={listProducts}/>
            </div>
            <div className={cx("pagination-container")}>
              <PaginationComponent pageSize={5} onPageChange={handleChange} totalItems={listProducts.length}/>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ListProduct;
