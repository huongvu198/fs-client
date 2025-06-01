import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import RadioComponent from "@components/RadioComponent";
import { Button, InputNumber, Spin } from "antd";
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
import { ICartResponse } from "interfaces/cart.interface";
import { hasAccessToken, hasLocalAccessToken } from "@config/accessToken";
import { useReduxSelector } from "@hooks/useRedux";
import { addToCartApi } from "@redux/cartSlice";
import { useCartContext } from "contexts/cartContext";
import { showToast, ToastType } from "shared/toast";

const cx = classNames.bind(styles);

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<ApiDispatch>();
  const { loading } = useReduxSelector((state) => state.cart);
  const productData = useSelector(productById);
  const newArrivalsData = useSelector(newArrivals);
  const navigate = useNavigate();
  const [selectorColor, setSelectorColor] = useState<string>("");
  const [availableSize, setAvailableSize] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [isSelectedColorActive, setIsSelectedColorActive] =
    useState<boolean>(false);
  const { setCart } = useCartContext();
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

    const isColorActive = variant.isActive;

    return variant.sizes.map((sizeData) => ({
      id: sizeData.id,
      label: sizeData.size,
      inventory: sizeData.inventory,
      isActive: sizeData.isActive && isColorActive,
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

    setIsSelectedColorActive(selectedVariant?.isActive ?? false);

    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      setMainImage(selectedVariant.images[0].url);
    }
  }, [selectorColor]);

  if (!productData) {
    return <Spin size="large" fullscreen={true} />;
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

  const handleAddToCart = async () => {
    const selectedColorObj = colorOptions.find(
      (color) => color.id === selectorColor
    );
    const selectedSizeObj = availableSize.find(
      (size) => size.id === selectedSize
    );

    if (!selectedColorObj || !selectedSizeObj) return;

    const cartDetail: ICartResponse = {
      id: "",
      items: [
        {
          id: id || "",
          quantity: quantity,
          status: "active",
          product: {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            discount: productData.discount ?? 0,
            discountPrice: currentPrice,
          },
          variant: {
            id: selectedColorObj.id,
            color: selectedColorObj.color,
            image: mainImage,
          },
          size: {
            id: selectedSizeObj.id,
            size: selectedSizeObj.label,
            inventory: selectedSizeObj.inventory ?? 0,
          },
        },
      ],
    };

    if (hasAccessToken() || hasLocalAccessToken()) {
      try {
        const resultAction = await dispatch(
          addToCartApi({
            productId: productData.id,
            variantId: selectedColorObj.id,
            sizeId: selectedSizeObj.id,
            quantity: quantity,
          })
        );

        if (addToCartApi.fulfilled.match(resultAction)) {
          showToast(ToastType.SUCCESS, "Đã thêm sản phẩm vào giỏ hàng!");
        }
      } catch (error) {
        showToast(ToastType.ERROR, "Thêm giỏ hàng thất bại!");
      }
    } else {
      const tempCart: ICartResponse = JSON.parse(
        localStorage.getItem("tempCart") ||
          JSON.stringify({
            id: "",
            items: [],
          })
      );

      const existingItemIndex = tempCart.items.findIndex(
        (item) =>
          item.product.id === cartDetail.items[0].product.id &&
          item.variant.id === cartDetail.items[0].variant.id &&
          item.size.id === cartDetail.items[0].size.id
      );

      if (existingItemIndex !== -1) {
        tempCart.items[existingItemIndex].quantity +=
          cartDetail.items[0].quantity;
      } else {
        tempCart.items.push(cartDetail.items[0]);
      }

      localStorage.setItem("tempCart", JSON.stringify(tempCart));
      setCart(tempCart);
      showToast(ToastType.SUCCESS, "Đã thêm sản phẩm vào giỏ hàng!");
    }
  };

  return (
    <>
      <div className={cx("product-detail-page")}>
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
                {/* <h3>Chọn màu xắc: {selectorColor}</h3> */}
                <h3>Chọn màu xắc </h3>
                <div className={cx("product-color-options")}>
                  {colorOptions.map((color) => (
                    <div
                      key={color.id}
                      className={cx("product-color-option", {
                        selected: selectorColor === color.id,
                        disabled: !color.isActive,
                      })}
                      style={{
                        backgroundColor: color.color,
                        pointerEvents: color.isActive ? "auto" : "none",
                        opacity: color.isActive ? 1 : 0.4,
                      }}
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
                {!isSelectedColorActive ? null : selectedSize ? (
                  <p>Còn sẵn {getMaxQuantity()} sản phẩm trong kho</p>
                ) : null}
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
                    controls={false}
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
                  disabled={
                    !selectedSize || !selectorColor || !isSelectedColorActive
                  }
                  loading={loading}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Reviews id={id} dispatch={dispatch} />
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
