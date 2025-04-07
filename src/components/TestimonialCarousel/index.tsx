import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const cx = classNames.bind(styles);

interface Testimonial {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  text: string;
}

interface Props {
  testimonials: Testimonial[];
}

const TestimonialsCarousel = ({ testimonials }: Props) => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className={cx("testimonials-container")}>
      <div className={cx("testimonials-header")}>
        <h2 className={cx("testimonials-heading")}>OUR HAPPY CUSTOMERS</h2>
        <div className={cx("navigate-button")}>
          <ArrowLeftOutlined className={cx("nav-button")} onClick={goToPrev} />
          <ArrowRightOutlined className={cx("nav-button")} onClick={goToNext} />
        </div>
      </div>

      <div className={cx("slider-container")}>
        <Slider ref={sliderRef} {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={cx("testimonial-card")}>
              <div className={cx("rating-star")}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={cx("star")}>
                    {i < testimonial.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <div className={cx("customer-info")}>
                <span className={cx("customer-name")}>{testimonial.name}</span>
                {testimonial.verified && (
                  <CheckCircleFilled style={{ color: "green" }} />
                )}
              </div>

              <p className={cx("testimonial-text")} color="#52c41a">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
