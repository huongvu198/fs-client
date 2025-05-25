import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface StyleCategory {
  id: string;
  image: string;
}

const StyleBannerComponent = () => {
  const styleCategories: StyleCategory[] = [
    {
      id: "casual",
      image:
        "https://cotton4u.vn/files/news/2025/05/20/fb15f725740de048428eaeabb74efa41.webp",
    },
    {
      id: "formal",
      image:
        "https://cotton4u.vn/files/news/2025/04/15/63fbae2cbd8adde79d504aafcfe92eee.webp",
    },
    {
      id: "party",
      image:
        "https://cotton4u.vn/files/news/2025/04/23/0cd827900f8d75840487982c44506798.webp",
    },
    {
      id: "gym",
      image:
        "https://cotton4u.vn/files/news/2025/04/23/b3a784188300166658c479d859c18f69.webp",
    },
  ];

  return (
    <div className={cx("style-banner-container")}>
      <h2 className={cx("style-banner-heading")}>BROWSE BY DRESS STYLE</h2>

      <div className={cx("style-banner-grid")}>
        {styleCategories.map((category) => (
          <div key={category.id} className={cx("category-card")}>
            <div className={cx("category-content")}>
              <div className={cx("image-container")}>
                <img
                  src={category.image}
                  alt={`${category} style`}
                  className={cx("category-image")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleBannerComponent;
