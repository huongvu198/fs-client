import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ButtonComponent from "@components/ButtonComponent";
import { useEffect, useRef } from "react";
import { animate } from "motion";

const cx = classNames.bind(styles);

interface Props {
  title: string;
  subTitle: string;
  buttonText: string;
  stats: {
    label: string;
    value: number;
  }[];
  imgSrc: string;
}

const BannerComponent = ({ title, subTitle, stats, imgSrc }: Props) => {
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    stats.forEach((_, index) => {
      if (numberRefs.current[index]) {
        animate(
          numberRefs.current[index],
          { y: [0, 8], opacity: [0, 1] },
          { duration: 0.6, ease: "circInOut" }
        );
      }
    });
  }, [stats]);
  return (
    <div className={cx("banner-container")}>
      <div className={cx("banner-content-side")}>
        <h1 className={cx("banner-title")}>{title}</h1>
        <p className={cx("banner-subtitle")}>{subTitle}</p>
        <div className={cx("button-container")}>
          <ButtonComponent type="primary">
            Shop Now
          </ButtonComponent>
        </div>

        <div className={cx("stats-container")}>
          {stats.map((stat, index) => (
            <div key={index} className={cx("stat-item")}>
              <div
                ref={(el) => (numberRefs.current[index] = el)}
                className={cx("stat-value")}
              >
                {stat.value}
              </div>
              <div className={cx("stat-label")}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={cx("image-side")}>
        <img src={imgSrc} alt="Fashion models" className={cx("banner-image")} />
        <div className={cx("star-decor1")}></div>
        <div className={cx("star-decor2")}></div>
      </div>
    </div>
  );
};

export default BannerComponent;
