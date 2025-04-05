// Reviews.tsx
import React, { useState } from "react";
import { Button, Select, Rate, Dropdown, Space } from "antd";
import {
  MoreOutlined,
  FilterOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const { Option } = Select;

interface ReviewData {
  id: string;
  author: string;
  rating: number;
  verified: boolean;
  content: string;
  date: string;
  highlighted?: boolean;
}

interface ReviewsProps {
  initialReviews: ReviewData[];
  additionalReviews: ReviewData[];
}

const Reviews = ({ initialReviews, additionalReviews }: ReviewsProps) => {
    const [displayedReviews, setDisplayedReviews] = useState<ReviewData[]>(initialReviews);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);
    const [sortOption, setSortOption] = useState('latest');

  const handleLoadMore = () => {
    if (!hasLoadedMore) {
      setDisplayedReviews([...displayedReviews, ...additionalReviews]);
      setHasLoadedMore(true);
    }
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    let sortedReviews = [...displayedReviews];

    if (value === "latest") {
      sortedReviews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (value === "highest") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (value === "lowest") {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    }

    setDisplayedReviews(sortedReviews);
  };

  const reviewActions = [
    {
      key: "report",
      label: "Report Review",
    },
    {
      key: "helpful",
      label: "Mark as Helpful",
    },
  ];

  return (
    <div className={cx("reviews-container")}>
      <div className={cx("reviews-header")}>
        <h2 className={cx("reviews-title")}>
          All Reviews <span className={cx("review-count")}>(451)</span>
        </h2>
        <div className={cx("reviews-controls")}>
          <Button icon={<FilterOutlined />} className={cx("filter-button")} />
          <Select
            defaultValue="latest"
            onChange={handleSortChange}
            className={cx("sort-select")}
            suffixIcon={null}
          >
            <Option value="latest">Latest</Option>
            <Option value="highest">Highest Rated</Option>
            <Option value="lowest">Lowest Rated</Option>
          </Select>
          <Button type="primary" className={cx("write-review-button")}>
            Write a Review
          </Button>
        </div>
      </div>

      <div className={cx("reviews-list")}>
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className={`${cx("reivew-card")} ${review.highlighted ? cx("highlighted-review") : ""}`}
          >
            <div className={cx("review-header")}>
              <div className={cx("rating-selection")}>
                <Rate disabled defaultValue={review.rating} allowHalf />
              </div>
              <Dropdown
                menu={{ items: reviewActions }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className={cx("more-button")}
                />
              </Dropdown>
            </div>

            <div className={cx("review-author")}>
              <span className={cx("author-name")}>{review.author}</span>
              {review.verified && (
                <CheckCircleFilled className={cx("verified-badge")} />
              )}
            </div>

            <div className={cx("review-content")}>
              <p>{review.content}</p>
            </div>

            <div className={cx("review-footer")}>
              <span className={cx("review-date")}>Posted on {review.date}</span>
            </div>
          </div>
        ))}
      </div>

      {!hasLoadedMore && (
        <div className={cx("load-more-container")}>
          <Button onClick={handleLoadMore} className={cx("load-more-btn")}>
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
