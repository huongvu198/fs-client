import classNames from "classnames/bind";
import styles from "./index.module.scss";
import BreadcrumbComponent from "@components/BreadCrumbComponent";
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
import useNotification from "@hooks/useNotification";
import { useReduxSelector } from "@hooks/useRedux";
import { addToCartApi } from "@redux/cartSlice";
import { useCartContext } from "contexts/cartContext";

const cx = classNames.bind(styles);

const initialReviews = [
  {
    id: "1",
    author: "Nguyễn Thị Lan",
    rating: 4.5,
    verified: true,
    content:
      "Tôi thực sự yêu chiếc áo phông này! Thiết kế rất độc đáo và vải rất thoải mái. Là một nhà thiết kế, tôi đánh giá cao sự chú ý đến chi tiết. Đây đã trở thành chiếc áo yêu thích của tôi.",
    date: "14 tháng 8, 2025",
  },
  {
    id: "2",
    author: "Trần Minh Tú",
    rating: 5,
    verified: true,
    content:
      "Chiếc áo này đã vượt quá mong đợi của tôi! Màu sắc rất sống động và chất lượng in ấn tuyệt vời. Là một nhà thiết kế UI/UX, tôi rất kỹ tính về thẩm mỹ, và chiếc áo này chắc chắn xứng đáng nhận sự đồng ý của tôi.",
    date: "15 tháng 8, 2025",
  },
  {
    id: "3",
    author: "Lê Văn Hòa",
    rating: 3.5,
    verified: true,
    content:
      "Chiếc áo phông này là món đồ không thể thiếu đối với ai yêu thích thiết kế tốt. Họa tiết tối giản nhưng phong cách đã thu hút sự chú ý của tôi, và form dáng rất vừa vặn. Tôi có thể thấy dấu ấn của nhà thiết kế trong từng chi tiết của chiếc áo này.",
    date: "16 tháng 8, 2025",
  },
  {
    id: "4",
    author: "Phan Thị Thu",
    rating: 5,
    verified: true,
    content:
      "Là một người yêu thích UI/UX, tôi rất coi trọng sự đơn giản và tính chức năng. Chiếc áo này không chỉ thể hiện những nguyên tắc đó mà còn cảm giác rất thoải mái khi mặc. Có thể thấy rằng nhà thiết kế đã dành rất nhiều sáng tạo để làm chiếc áo này nổi bật.",
    date: "17 tháng 8, 2025",
  },
  {
    id: "5",
    author: "Vũ Quang Huy",
    rating: 4,
    verified: true,
    content:
      "Chiếc áo phông này là sự kết hợp giữa sự thoải mái và sự sáng tạo. Vải rất mềm mại và thiết kế nói lên tài năng của nhà thiết kế. Nó giống như mặc một tác phẩm nghệ thuật phản ánh đam mê của tôi đối với thiết kế và thời trang.",
    date: "18 tháng 8, 2025",
    highlighted: true,
  },
  {
    id: "6",
    author: "Nguyễn Thị Mai",
    rating: 4.5,
    verified: true,
    content:
      "Tôi không chỉ mặc một chiếc áo phông; tôi đang mặc một tác phẩm của triết lý thiết kế. Những chi tiết tinh xảo và bố cục thiết kế đầy suy nghĩ khiến chiếc áo này trở thành một chủ đề trò chuyện.",
    date: "19 tháng 8, 2025",
  },
];

const additionalReviews = [
  {
    id: "7",
    author: "Hoàng Đức Nam",
    rating: 5,
    verified: true,
    content:
      "Sự chú ý đến chi tiết trên chiếc áo này thật tuyệt vời. Chất liệu vải xuất sắc và thiết kế vừa hợp thời trang vừa trường tồn. Chắc chắn xứng đáng với từng đồng bỏ ra!",
    date: "20 tháng 8, 2025",
  },
  {
    id: "8",
    author: "Trương Thanh Tâm",
    rating: 4,
    verified: true,
    content:
      "Tôi đã nhận được rất nhiều lời khen khi mặc chiếc áo này. Thiết kế rất độc đáo và vải rất mềm mại. Nó đã trở thành chiếc áo yêu thích của tôi cho cả dịp thường ngày và bán chính thức.",
    date: "21 tháng 8, 2025",
  },
  {
    id: "9",
    author: "Đặng Tiến Mạnh",
    rating: 3.5,
    verified: false,
    content:
      "Chất lượng và thiết kế nhìn chung khá tốt. Form áo hơi rộng hơn mong đợi, nhưng chất liệu vải cảm giác cao cấp. Mực in vẫn giữ được sau vài lần giặt.",
    date: "22 tháng 8, 2025",
  },
  {
    id: "10",
    author: "Nguyễn Thị Kim Anh",
    rating: 5,
    verified: true,
    content:
      "Chiếc áo này hoàn hảo khi cân bằng giữa phong cách và sự thoải mái. Thiết kế tinh tế nhưng nổi bật, khiến nó trở nên linh hoạt cho nhiều dịp khác nhau. Tôi đã lên kế hoạch mua thêm các màu khác!",
    date: "23 tháng 8, 2025",
  },
  {
    id: "11",
    author: "Lê Quang Minh",
    rating: 4.5,
    verified: true,
    content:
      "Là người coi trọng cả thẩm mỹ và tính năng, tôi rất ấn tượng với chiếc áo này. Vải thấm hút mồ hôi tốt khi tập luyện, và thiết kế giữ được độ sáng màu ngay cả sau nhiều lần giặt.",
    date: "24 tháng 8, 2025",
  },
];

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
  const { successMessage, errorMessage } = useNotification();
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
          successMessage({
            description: `Đã thêm sản phẩm vào giỏ hàng!`,
            title: "Giỏ hàng",
          });
          localStorage.setItem(
            "cartList",
            JSON.stringify(resultAction.payload)
          );
        } else {
          throw new Error();
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        errorMessage({
          description: `Thêm giỏ hàng thất bại!`,
          title: "Giỏ hàng",
        });
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
      successMessage({
        description: `Đã thêm sản phẩm vào giỏ hàng!`,
        title: "Giỏ hàng",
      });
    }
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
                {/* <h3>Chọn màu xắc: {selectorColor}</h3> */}
                <h3>Chọn màu xắc </h3>
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
                  disabled={!selectedSize || !selectorColor}
                  loading={loading}
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
