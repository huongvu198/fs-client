import Slider from "react-slick";
import { Card, Typography, Rate, Space } from "antd";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonComponent from "@components/ButtonComponent";
const cx = classNames.bind(styles);

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface ProductProps {
  isViewAll: boolean;
  isSlider: boolean;
  title?: string;
  products: Product[];
}

const ProductCardComponent = ({ product }: { product: Product }) => {
  return (
    <Card
      hoverable
      className={cx("card-container")}
      cover={
        <img
          alt={product.name}
          src={product.image}
          className={cx("card-image")}
        />
      }
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
          <Rate
            disabled
            defaultValue={product.rating}
            className={cx("rating")}
          />
          <span className={cx("rating-text")}>{product.rating}/5.0</span>
        </div>
        <Text className={cx("product-card-reviews")}>
          {product.reviews} reviews
        </Text>
        <Space>
          <Text strong className={cx("product-card-price")}>
            ${product.price}
          </Text>
          {product.originalPrice && (
            <Text delete className={cx("product-card-original-price")}>
              ${product.originalPrice}
            </Text>
          )}
          {product.discount && (
            <Text className={cx("product-card-discount")}>
              {product.discount}%
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
}: ProductProps) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: products.length < 6 ? products.length : 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div
      className={cx("section")}
      style={
        isSlider
          ? {}
          : { display: "flex", padding: 0, gap: "0.5rem", justifyContent:"flex-start", flexWrap:"wrap" }
      }
    >
      <div className={cx("section-header")} style={!title ? {display: 'none'}: {}}>
        <Title className={cx("section-title")}>{title}</Title>
      </div>
      {isSlider ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id}>
              <ProductCardComponent product={product} />
            </div>
          ))}
        </Slider>
      ) : (
        <>
          {products.map((product) => (
            <div key={product.id}>
              <ProductCardComponent product={product} />
            </div>
          ))}
        </>
      )}
      <div className={cx("view-all-container")}>
        {isViewAll && (
          <ButtonComponent className={cx("view-all-button")}>
            View All
          </ButtonComponent>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
