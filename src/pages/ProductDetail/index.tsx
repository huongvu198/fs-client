import classNames from "classnames/bind";
import styles from "./index.module.scss";
import BreadcrumbComponent from "@components/BreadCrumbComponent";
import { useEffect, useState } from "react";
import RadioComponent from "@components/RadioComponent";
import { Button, InputNumber } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Reviews from "@components/ReviewComponent";
import ProductSection from "@components/ProductCardComponent";
import Footer from "@components/FooterComponent";

const cx = classNames.bind(styles);
interface ProductVariantSize {
  size: string;
  quantity: number;
  soldQuantity: number;
  inventory: number;
  isActive: boolean;
}

interface ProductVariant {
  color: string;
  name: string;
  isActive: boolean;
  image: string;
  sizes: ProductVariantSize[];
}

interface ProductSubcategory {
  id: string;
  name: string;
  subCateSlug: string;
}

interface ProductCategory {
  id: string;
  name: string;
  cateSlug: string;
  subcategories: ProductSubcategory;
}

interface ProductSegment {
  id: string;
  name: string;
  slug: string;
  categories: ProductCategory;
}

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  segment: ProductSegment;
  discount: number;
  totalQuantity: number;
  totalSoldQuantity: number;
  totalInventory: number;
  variants: ProductVariant[];
}
const productData: ProductDetail = {
  id: "67e93a38072cd1d1f39775de",
  name: "One Life Graphic T-shirt",
  price: 260,
  description:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  isActive: false,
  isArchived: false,
  segment: {
    id: "67e7aca735bed35428f2d041",
    name: "Nữ",
    slug: "nu",
    categories: {
      id: "67e7acaf35bed35428f2d045",
      name: "Áo",
      cateSlug: "ao",
      subcategories: {
        id: "67e7acc435bed35428f2d04e",
        name: "Áo Thun",
        subCateSlug: "ao_thun",
      },
    },
  },
  discount: 12,
  totalQuantity: 10,
  totalSoldQuantity: 0,
  totalInventory: 10,
  variants: [
    {
      color: "#000000",
      name: "Black",
      isActive: true,
      image:
        "https://res.cloudinary.com/dd6xomqvi/image/upload/v1743338039/bnxnocr0jrouqz88jxko.jpg",
      sizes: [
        {
          size: "S",
          quantity: 5,
          soldQuantity: 0,
          inventory: 5,
          isActive: false,
        },
        {
          size: "M",
          quantity: 9,
          soldQuantity: 0,
          inventory: 9,
          isActive: false,
        },
        {
          size: "L",
          quantity: 8,
          soldQuantity: 0,
          inventory: 8,
          isActive: true,
        },
      ],
    },
    {
      color: "#ffffff",
      name: "White",
      isActive: true,
      image:
        "https://s3-alpha-sig.figma.com/img/21d6/bcec/533545a2b1e10e90b8059bc1bc97eab5?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=AiinMCmcHBOgs8-WWnmRouPX2rLvEErIRgquCFuoI4bA01y7Yw8vI1mROLLoHu6gfDaQ8DnXuoEiAyQ3kjy5NGjpAKChq9ZKr5dtKapbk8W1QMO8RTsXvK7f7dotbxCcm2f-8XzHcJv2ODFC8O7PzVL16kRHWoak4~8hvebeqaEfP~tGQUvIhBoNn40COQ38Y59J0qAIh-rVJbQJ5BAVGFmZrIF8YzM7f57vZHFMst8J1HCCyqJVKBY0kbfQewWKAHhnU4NxWRx4dX7hSuH8XI2vNUXZEklgGZajLX99yg7obs9FowtdnxR8t~NM8EoGWsTnZkKi7Gxvw2ZgpZUFkw__",
      sizes: [
        {
          size: "M",
          quantity: 1,
          soldQuantity: 0,
          inventory: 1,
          isActive: false,
        },
      ],
    },
  ],
};

const newArrivals = [
  {
    id: "1",
    name: "T-shirt with Tape Details",
    image:
      "https://s3-alpha-sig.figma.com/img/d40d/a9a3/a7234235e66d6695d9d7098fc3289872?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qZZX3x1fJDAKFkr8urNbWJfRHBb0sycIcGsuukEen-33jNs7GIBCMhItTT2shJFncUenuqvORqpmU18IiCKqGMn~0D2HKeI5fWyPVcyPZlmgGkEpkVu5nMZ4tx2MIBwPPpiRHasUvQg0BuOvdjFSpojq~XXxMAA7seKk-AJkFCZ79wXbtMCpnawXBhLtsFCGKnDLIVzklyFYB6sZdN4W5pNUztTpEFfcgx2bXjsDeceGfzJyzZzAC8CAby-cSxW~fryvaIhEsJdlpf~nSdm-LqGCSz8YQGZDAa3i1Hqbw~aAXs5Z~cRkA2W93noWB3DcYfKGhTV6xfyg5FkrRu6xuQ__",
    rating: 4.5,
    reviews: 456,
    price: 120,
  },
  {
    id: "2",
    name: "Skinny Fit Jeans",
    image:
      "https://s3-alpha-sig.figma.com/img/769b/9d60/ff941dde9bc0e54431b8d8fe3182f5e9?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oteEkJ5zz80QQdDcIjM8q0dYNMdXKzFpQnda5HpXj-z-We2i84haDV38JTH8HjjLU8lDYyjPauM6HUOCM~EjbNiZAdcqE6x9CzJ~Sx489ORVEWSJ8IoMzm5xbtdM2U3MLvk0iFnifLWjKfs5rfpeXHS160B9e5WTM-Ry5D8sfU3rnDgwXzmt79GdRwKRCW8AltukPX~HWzioC-zhcuN5lD74ZLfAKbMgw5hAy5ULF0NTWMlIpkesdwAQ2EEorOlyrdIUqR9Bj0kKRFlifNS-WGpERzgfLaDTzj03dUSkp3d9kURDEh8ZmDPCCyBsnP3fusQi5eqiIw7DAtN~1JeX5A__",
    rating: 3.6,
    reviews: 156,
    price: 240,
    originalPrice: 260,
    discount: 20,
  },
  {
    id: "3",
    name: "Checkered Shirt",
    image:
      "https://s3-alpha-sig.figma.com/img/bbf4/11c2/5fc84f87eeac1062fbe47f49c192d4f2?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QB3LlOBw6XdqifXwkDQBs~n2mTOulcrIKH4DVvom3Jm5Z8317y6QCXhZW16hgp0QregOPSIHBisoHxkUvbmskP3cygKfsoVlUqVq2N~lZdoNY3s4AIxuJrQC4eebvDpGbt101uaBhrKTYXhDwOe1Q8kXnW-1lvVRedpQTb4~Hln-yxv3ohMHH3NmTMr9sQq-KoyeZoAGBESuGvCz--uyg73xQkuwlsOSJDmXo8hLSK9jp0Sakw1waPUgKEnwyegjQ1qKIPFhuCXZ1V9LEOoLxb5c2IkdcqWzocti7KdHdO~MX3UhdKaJdaI5cfQjn513P1p-Eyp9cPJWwgytuZXMOQ__",
    rating: 4.0,
    reviews: 420,
    price: 180,
  },
  {
    id: "4",
    name: "Sleeve Striped T-shirt",
    image:
      "https://s3-alpha-sig.figma.com/img/3457/42c2/7cc557f42cf1d489f7cc811856b90e9f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oibsEAsthIhdRfYWblNCFprzHb88xr~1vQGsFxALXGPZ0RGdU1uN9IB4u538HyEFfWyQiVzX2-C6YuKl-8lO2NdQcqMzMEriUXXEteDbeIm~5E52RdPIHoLjRD6~9eWkBi9v-3QNBKndUuaWTH2V9DAKerqP-kZM-x350GoLxDm-G1poJlWpLtpl9oLK1VZvipPwIQKrV9YVa5ipBmtjGp2VC-f057Qbz2yZZtgTrWS9T-ElD9RhrmzMjqDwVT-wkoe8gy0JqAlMelDR9-XMS32mpA2b-pzBtIm9FIL5DObkwnMcBCfQeqP4PMx4E2B29aysqpimfDMBAxBACGP9dA__",
    rating: 4.5,
    reviews: 456,
    price: 130,
    originalPrice: 160,
    discount: 20,
  },
];

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
  const originalPrice = productData.price;
  const discountPercentage = productData.discount;
  const currentPrice = originalPrice * (1 - discountPercentage / 100);

  const colorOptions = productData.variants.map((variant) => ({
    id: variant.color,
    value: variant.color,
    name: variant.name,
    image: variant.image,
    isActive: variant.isActive,
  }));

  const getAvailableSizes = (colorName: string) => {
    const variant = productData.variants.find(
      (variant) => variant.name === colorName
    );
    if (!variant) return [];

    return variant.sizes.map((sizeData) => ({
      id: sizeData.size,
      label: sizeData.size,
      inventory: sizeData.inventory,
      isActive: sizeData.isActive,
    }));
  };
  //state
  const [selectorColor, setSelectorColor] = useState<string>(
    colorOptions[0]?.name || ""
  );
  const [availableSize, setAvailableSize] = useState(
    getAvailableSizes(selectorColor)
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>(
    colorOptions[0]?.image || ""
  );

  useEffect(() => {
    const sizes = getAvailableSizes(selectorColor);
    setAvailableSize(sizes);

    if (sizes.length > 0 && !sizes.some((size) => size.id === selectedSize)) {
      setSelectedSize(sizes[0].id);
    }

    const variant = productData.variants.find(
      (variant) => variant.color === selectorColor
    );
    if (variant) {
      setMainImage(variant.image);
    }
  }, [selectorColor]);

  const productImages = productData.variants.map((variant) => ({
    id: variant.color,
    src: variant.image,
    alt: "unknown image",
  }));

  const handleImageClick = (src: string, colorId: string) => {
    setMainImage(src);
    setSelectorColor(colorId);
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
    const variant = productData.variants.find((v) => v.name === selectorColor);
    if (!variant) return 1;

    const sizeData = variant.sizes.find((s) => s.size === selectedSize);
    return sizeData?.inventory || 1;
  };

  const handleAddToCart = () => {
    const selectedColorObj = colorOptions.find(
      (color) => color.id === selectorColor
    );
    const selectedSizeObj = availableSize.find(
      (size) => size.id === selectedSize
    );

    const cartDetail = {
      productId: productData.id,
      productName: productData.name,
      originalPrice: originalPrice,
      discountPrice: currentPrice,
      discountPercentage: discountPercentage,
      color: selectedColorObj?.name || "",
      colorHex: selectorColor,
      size: selectedSizeObj?.label || "",
      quantity: quantity,
      totalPrice: currentPrice * quantity,
      image: mainImage,
    };
    console.log("🚀 ~ handleAddToCart ~ cartDetail:", cartDetail)
  };

  const breadCrumbItems = [
    productData.segment.name,
    productData.segment.categories.name,
    productData.segment.categories.subcategories.name,
  ];

  return (
    <>
      <div className={cx("product-detail-page")}>
        <BreadcrumbComponent items={breadCrumbItems} />

        <div className={cx("product-detail-container")}>
          <div className={cx("product-image-gallery")}>
            <div className={cx("product-thumnails")}>
              {productImages.map((image) => (
                <div
                  key={image.id}
                  className={`${cx("product-thumnail", { active: mainImage === image.src })}`}
                  onClick={() => handleImageClick(image.src, image.id)}
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
                {currentPrice.toLocaleString()}₫
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className={cx("product-original-price")}>
                    {originalPrice.toLocaleString()}₫
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
                <h3>Colors: {selectorColor}</h3>
                <div className={cx("product-color-options")}>
                  {colorOptions
                    .filter((color) => color.isActive)
                    .map((color) => (
                      <div
                        key={color.id}
                        className={`${cx("product-color-option", { selected: selectorColor === color.name })}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorChange(color.name)}
                        title={color.name}
                      />
                    ))}
                </div>
              </div>

              <div className={cx("product-size-selector")}>
                <h3>Choose Size</h3>
                <RadioComponent
                  options={availableSize}
                  value={selectedSize}
                  onChange={handleSizeChange}
                />
              </div>

              <div className={cx("product-inventory-info")}>
                {selectedSize && <p>Available: {getMaxQuantity()} items</p>}
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
                  Add to Cart
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
            products={newArrivals}
            justifyContent="center"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
