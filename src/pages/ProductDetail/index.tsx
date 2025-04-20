import classNames from "classnames/bind";
import styles from "./index.module.scss";
import BreadcrumbComponent from "@components/BreadCrumbComponent";
import { useEffect, useState } from "react";
import RadioComponent from "@components/RadioComponent";
import { Button, InputNumber } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiDispatch } from "@reduxjs/toolkit";
import {
  getNewArrivals,
  getProductById,
  newArrivals,
  productById,
} from "@redux/productSlice";
import { calculateDiscountedPrice } from "shared/common";
import ProductSection from "@components/ProductCardComponent";
import Reviews from "@components/ReviewComponent";
import { FormattedNumber } from "react-intl";
import { ICart } from "interfaces/cart.interface";

const cx = classNames.bind(styles);

const initialReviews = [
  {
    id: "1",
    author: "Samantha D.",
    rating: 4.5,
    verified: true,
    content:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    date: "August 14, 2023",
  },
  {
    id: "2",
    author: "Alex M.",
    rating: 5,
    verified: true,
    content:
      "This shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    date: "August 15, 2023",
  },
  {
    id: "3",
    author: "Ethan R.",
    rating: 3.5,
    verified: true,
    content:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt.",
    date: "August 16, 2023",
  },
  {
    id: "4",
    author: "Olivia P.",
    rating: 5,
    verified: true,
    content:
      "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out.",
    date: "August 17, 2023",
  },
  {
    id: "5",
    author: "Liam K.",
    rating: 4,
    verified: true,
    content:
      "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion.",
    date: "August 18, 2023",
    highlighted: true,
  },
  {
    id: "6",
    author: "Ava H.",
    rating: 4.5,
    verified: true,
    content:
      "I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    date: "August 19, 2023",
  },
];

const additionalReviews = [
  {
    id: "7",
    author: "Noah J.",
    rating: 5,
    verified: true,
    content:
      "The attention to detail on this shirt is remarkable. The fabric quality is exceptional, and the design is both trendy and timeless. Definitely worth every penny!",
    date: "August 20, 2023",
  },
  {
    id: "8",
    author: "Emma T.",
    rating: 4,
    verified: true,
    content:
      "I've received so many compliments wearing this t-shirt. The design is unique and the fabric is incredibly soft. It's become my go-to shirt for both casual and semi-formal occasions.",
    date: "August 21, 2023",
  },
  {
    id: "9",
    author: "Jackson B.",
    rating: 3.5,
    verified: false,
    content:
      "Overall good quality and design. The fit is slightly larger than expected, but the material feels premium. The print has held up well after several washes.",
    date: "August 22, 2023",
  },
  {
    id: "10",
    author: "Sophia C.",
    rating: 5,
    verified: true,
    content:
      "This t-shirt perfectly balances style and comfort. The design is subtle yet distinctive, making it versatile for various occasions. I'm already planning to buy it in other colors!",
    date: "August 23, 2023",
  },
  {
    id: "11",
    author: "Lucas P.",
    rating: 4.5,
    verified: true,
    content:
      "As someone who values both aesthetics and functionality, I'm impressed with this t-shirt. The fabric breathes well during workouts, and the design maintains its vibrancy even after multiple washes.",
    date: "August 24, 2023",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<ApiDispatch>();
  const productData = useSelector(productById);
  const newArrivalsData = useSelector(newArrivals);
  const navigate = useNavigate();

  const [selectorColor, setSelectorColor] = useState<string>("");
  const [availableSize, setAvailableSize] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    dispatch(getProductById(id));
    dispatch(getNewArrivals());
  }, [id, dispatch]);

  useEffect(() => {
    if (!productData) return;
    if (productData) {
      const initialColorId = productData.variants[0]?.id || "";
      setSelectorColor(initialColorId);
      setMainImage(productData.variants[0]?.images[0]?.url || "");
    }
  }, [productData]);

  const getAvailableSizes = (colorId: string) => {
    const variant = productData?.variants.find(
      (variant) => variant.id === colorId
    );
    if (!variant) return [];

    return variant.sizes.map((sizeData) => ({
      id: sizeData.id,
      label: sizeData.size,
      inventory: sizeData.inventory,
      isActive: sizeData.isActive,
    }));
  };

  useEffect(() => {
    const sizes = getAvailableSizes(selectorColor);
    setAvailableSize(sizes);

    if (sizes.length > 0 && !sizes.some((size) => size.id === selectedSize)) {
      setSelectedSize(sizes[0].id);
    }

    if (!productData) return;

    const selectedVariant = productData.variants.find(
      (variant) => variant.id === selectorColor
    );
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      setMainImage(selectedVariant.images[0].url);
    }
  }, [selectorColor]);

  if (!productData) {
    return <div className="loading">Loading product...</div>;
  }

  const { originalPrice, discountPercentage, currentPrice } =
    calculateDiscountedPrice(productData.price, productData.discount);

  const colorOptions = productData.variants.map((color) => ({
    id: color.id,
    color: color.color,
    isActive: color.isActive,
  }));

  const handleImageClick = (src: string) => {
    setMainImage(src);
  };

  const handleColorChange = (colorId: string) => {
    setSelectorColor(colorId);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const getMaxQuantity = (): number => {
    const variant = productData.variants.find((v) => v.id === selectorColor);
    if (!variant) return 1;

    const sizeData = variant.sizes.find((s) => s.id === selectedSize);
    return sizeData?.inventory || 1;
  };

  const handleAddToCart = () => {
    const selectedColorObj = colorOptions.find(
      (color) => color.id === selectorColor
    );
    const selectedSizeObj = availableSize.find(
      (size) => size.id === selectedSize
    );

    if (!selectedColorObj) return;
    const cartDetail: ICart = {
      productId: productData.id,
      variantId: selectedColorObj.id,
      sizeId: selectedSizeObj.id,
      quantity: quantity,
    };
    console.log("🚀 ~ handleAddToCart ~ cartDetail:", cartDetail);
  };

  const breadCrumbItems = [
    productData.segment.name,
    productData.segment.category.name,
    productData.segment.category.subCategory.name,
  ];

  return (
    <>
      <div className={cx("product-detail-page")}>
        <BreadcrumbComponent items={breadCrumbItems} />

        <div className={cx("product-detail-container")}>
          <div className={cx("product-image-gallery")}>
            <div className={cx("product-thumnails")}>
              {productData.variants
                .filter((variant) => variant.id === selectorColor)
                .flatMap((variant) =>
                  variant.images.map((img) => ({
                    id: img.id,
                    src: img.url,
                    alt: `Unknown`,
                    variantId: variant.id,
                  }))
                )
                .map((image) => (
                  <div
                    key={image.id}
                    className={`${cx("product-thumnail", { active: mainImage === image.src })}`}
                    onClick={() => handleImageClick(image.src)}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
            </div>
            <div className={cx("product-main-image")}>
              <img src={mainImage} alt={`${productData.name}`} />
            </div>
          </div>

          <div className={cx("product-info")}>
            <h1 className={cx("product-name")}>{productData.name}</h1>

            <div className={cx("price-container")}>
              <span className={cx("product-current-price")}>
                <FormattedNumber
                  value={currentPrice}
                  style="currency"
                  currency="VND"
                />
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className={cx("product-original-price")}>
                    <FormattedNumber
                      value={originalPrice}
                      style="currency"
                      currency="VND"
                    />
                  </span>
                  <span className={cx("product-discount")}>
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className={cx("product-description")}>
              {productData.description}
            </p>

            <div className={cx("product-options")}>
              <div className={cx("product-color-selector")}>
                <h3>Chọn màu xắc: {selectorColor}</h3>
                <div className={cx("product-color-options")}>
                  {colorOptions
                    .filter((color) => color.isActive)
                    .map((color) => (
                      <div
                        key={color.id}
                        className={`${cx("product-color-option", { selected: selectorColor === color.id })}`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => handleColorChange(color.id)}
                        title={color.color}
                      />
                    ))}
                </div>
              </div>

              <div className={cx("product-size-selector")}>
                <h3>Chọn kích cỡ</h3>
                <RadioComponent
                  options={availableSize.map((size) => ({
                    ...size,
                    inventory: size.inventory || 0,
                  }))}
                  value={selectedSize}
                  onChange={handleSizeChange}
                />
              </div>

              <div className={cx("product-inventory-info")}>
                {selectedSize && (
                  <p>Còn sẵn {getMaxQuantity()} sản phẩm trong kho</p>
                )}
              </div>

              <div className={cx("product-quantity-cart")}>
                <div className={cx("product-quantity-selector")}>
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() =>
                      handleQuantityChange(Math.max(1, quantity - 1))
                    }
                    disabled={quantity <= 1}
                    className={cx("product-quantity-button")}
                  />
                  <InputNumber
                    min={1}
                    max={getMaxQuantity()}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className={cx("product-quantity-input")}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      handleQuantityChange(
                        Math.min(getMaxQuantity(), quantity + 1)
                      )
                    }
                    disabled={quantity >= getMaxQuantity()}
                    className={cx("product-quantity-button")}
                  />
                </div>

                <Button
                  type="primary"
                  className={cx("product-add-cart")}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectorColor}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Reviews
          initialReviews={initialReviews}
          additionalReviews={additionalReviews}
        />
        <div className={cx("product-card-container")}>
          <ProductSection
            isSlider={true}
            isViewAll={false}
            title="You might also like"
            products={newArrivalsData}
            justifyContent="center"
            navigate={navigate}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
