import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface StyleCategory {
  id: string;
  name: string;
  image: string;
}

const StyleBannerComponent = () => {
  const styleCategories: StyleCategory[] = [
    {
      id: "casual",
      name: "Casual",
      image:
        "https://hauterhub.gagmat.com/admin/storage/media/61/catalogue/Hauter-hub-tshirt-(1).webp",
    },
    {
      id: "formal",
      name: "Formal",
      image:
        "https://citycenterone.hr/zagreb-west/wp-content/uploads/sites/2/2021/02/Galileo_2.jpg",
    },
    {
      id: "party",
      name: "Party",
      image:
        "https://www.notbin.com/wp-content/uploads/2024/08/product-20-1.jpg",
    },
    {
      id: "gym",
      name: "Gym",
      image:
        "https://img.freepik.com/free-photo/portrait-young-man-holding-dumbbell_144627-21871.jpg",
    },
  ];

  return (
    <div className={cx("style-banner-container")}>
      <h2 className={cx("style-banner-heading")}>BROWSE BY DRESS STYLE</h2>

      <div className={cx("style-banner-grid")}>
        {styleCategories.map((category) => (
          <div key={category.id} className={cx("category-card")}>
            <div className={cx("category-content")}>
              <h3 className={cx("category-name")}>{category.name}</h3>
              <div className={cx("image-container")}>
                <img
                  src={category.image}
                  alt={`${category.name} style`}
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
