import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const BannerComponent = () => {
  return (
    <div className={cx("banner-container")}>
      <img
        src="https://cotton4u.vn/files/news/2025/03/18/3e579b172797373d581aecfa963b3bbf.webp"
        alt="Banner"
        className={cx("banner-image")}
      />
    </div>
  );
};

export default BannerComponent;
