import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import { Card, Typography, Rate, Space } from "antd";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonComponent from "@components/ButtonComponent";
import { IProductResponse, Product } from "interfaces/product.interface";
import { FormattedNumber } from "react-intl";
import { NavigateFunction } from "react-router-dom";
import { ProductDetailPath, ProductsQueryPath } from "@config/routerConfig";

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

interface ProductProps {
  isViewAll?: boolean;
  isSlider?: boolean;
  justifyContent: string;
  title?: string;
  products: IProductResponse[];
  tag?: string;
  navigate: NavigateFunction;
}

const ProductCardComponent = ({
  product,
  tag,
  navigate,
}: {
  product: Product;
  tag?: string;
  navigate: NavigateFunction;
}) => {
  return (
    <Card
      hoverable
      className={cx("card-container", "product-card")}
      cover={
        <div className={cx("image-container")}>
          <img
            alt={product.name}
            src={product.variants[0].images[0].url}
            className={cx("card-image")}
          />
          {tag && (
            <span
              className={cx("new-tag", tag.toLowerCase().replace(" ", "-"))}
            >
              {tag}
            </span>
          )}
          {product.discount > 0 && (
            <Text className={cx("product-discount-tag")}>
              -{product.discount}%
            </Text>
          )}
        </div>
      }
      onClick={() => navigate(ProductDetailPath.replace(":id", product.id))}
    >
      <Space
        direction="vertical"
        size={0}
        className={cx("product-card-content")}
      >
        <Text strong className={cx("product-card-name")}>
          {product.name}
        </Text>
        <div className={cx("rating-container")}>
          <Rate disabled defaultValue={5} className={cx("rating")} />
          <span className={cx("rating-text")}>5/5.0</span>
        </div>
        <Space>
          {product.discount > 0 ? (
            <>
              <Text strong className={cx("product-card-price")}>
                <FormattedNumber
                  value={product.price * (1 - product.discount / 100)}
                  style="currency"
                  currency="VND"
                />
              </Text>
              <Text delete className={cx("product-card-original-price")}>
                <FormattedNumber
                  value={product.price}
                  style="currency"
                  currency="VND"
                />
              </Text>
            </>
          ) : (
            <Text strong className={cx("product-card-price")}>
              <FormattedNumber
                value={product.price}
                style="currency"
                currency="VND"
              />
            </Text>
          )}
        </Space>
      </Space>
    </Card>
  );
};

const ProductSection = ({
  title,
  products,
  isViewAll = false,
  isSlider = false,
  justifyContent,
  tag,
  navigate,
}: ProductProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isLaptop = useMediaQuery({ minWidth: 1024, maxWidth: 1300 });
  const isSmallPC = useMediaQuery({ minWidth: 1301, maxWidth: 1699 });
  const isLargePC = useMediaQuery({ minWidth: 1700 });

  let slidesToShow = 4;
  if (isMobile) slidesToShow = 1;
  else if (isTablet) slidesToShow = 2;
  else if (isLaptop) slidesToShow = 3;
  else if (isSmallPC) slidesToShow = 4;
  else if (isLargePC) slidesToShow = 5;

  slidesToShow = Math.min(slidesToShow, products.length);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <div
        className={cx("section-header")}
        style={!title ? { display: "none" } : {}}
      >
        <Title className={cx("section-title")}>{title?.toUpperCase()}</Title>
      </div>
      <div
        className={cx("section")}
        style={
          isSlider
            ? {}
            : {
                display: "flex",
                padding: 0,
                gap: "0.5rem",
                justifyContent: justifyContent,
                flexWrap: "wrap",
              }
        }
      >
        {isSlider ? (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id}>
                <ProductCardComponent
                  product={product}
                  tag={tag}
                  navigate={navigate}
                />
              </div>
            ))}
          </Slider>
        ) : (
          products.map((product) => (
            <div key={product.id}>
              <ProductCardComponent
                product={product}
                tag={tag}
                navigate={navigate}
              />
            </div>
          ))
        )}
        <div className={cx("view-all-container")}>
          {isViewAll && (
            <ButtonComponent
              className={cx("view-all-button")}
              onClick={() =>
                navigate(
                  ProductsQueryPath({
                    tag: tag === "New" ? "new-arrivals" : "best-sellers",
                  })
                )
              }
            >
              Xem tất cả
            </ButtonComponent>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductSection;
