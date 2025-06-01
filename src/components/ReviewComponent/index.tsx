import { useEffect, useState } from "react";
import { Button, Select, Rate, Empty } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Review } from "../../interfaces/review.interface";
import { ApiDispatch } from "@redux/index";
import {
  getReviewByProductId,
  getReviewPaging,
  getReviewsRedux,
} from "@redux/reviewSlice";
import { useSelector } from "react-redux";
const cx = classNames.bind(styles);
const { Option } = Select;

interface ReviewsProps {
  id: string | undefined;
  dispatch: ApiDispatch;
}

const Reviews = ({ id, dispatch }: ReviewsProps) => {
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [, setSortOption] = useState("latest");
  const reviewsRedux = useSelector(getReviewsRedux);
  const pagination = useSelector(getReviewPaging);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);

  useEffect(() => {
    if (id) {
      dispatch(getReviewByProductId({ id, page, perPage }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setDisplayedReviews(reviewsRedux);
    setPage(pagination.currentPage);
    setPerPage(pagination.perPage);
    if (pagination.currentPage === pagination.totalPages) {
      setHasLoadedMore(false);
    } else {
      setHasLoadedMore(true);
    }
  }, [reviewsRedux, pagination]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    const sortedReviews = [...displayedReviews];

    if (value === "latest") {
      sortedReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (value === "highest") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (value === "lowest") {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    }

    setDisplayedReviews(sortedReviews);
  };

  return (
    <div className={cx("reviews-container")}>
      <div className={cx("reviews-header")}>
        <h2 className={cx("reviews-title")}>
          Đánh giá sản phẩm{" "}
          <span className={cx("review-count")}>({pagination.totalItems})</span>
        </h2>
        <div className={cx("reviews-controls")}>
          <Button icon={<FilterOutlined />} className={cx("filter-button")} />
          <Select
            defaultValue="latest"
            onChange={handleSortChange}
            className={cx("sort-select")}
            suffixIcon={null}
          >
            <Option value="latest">Mới nhất</Option>
            <Option value="highest">Đánh giá cao nhất</Option>
            <Option value="lowest">Đánh giá thấp nhất</Option>
          </Select>
        </div>
      </div>

      <div className={cx("reviews-list")}>
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className={`${cx("reivew-card")}`}>
              <div className={cx("review-header")}>
                <div className={cx("review-author")}>
                  <span className={cx("author-name")}>
                    {review.user.fullName}
                  </span>
                </div>
              </div>

              <div
                className={cx("rating-selection")}
                style={{ marginBottom: 8 }}
              >
                <Rate disabled defaultValue={review.rating} allowHalf />
              </div>

              <div className={cx("review-content")}>
                <p>{review.comment}</p>
              </div>

              <div className={cx("review-footer")}>
                <span className={cx("review-date")}>
                  Posted on {review.createdAt}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={cx("empty-review-wrapper")}>
            <Empty description="Chưa có đánh về sản phẩm" />
          </div>
        )}
      </div>

      {hasLoadedMore && (
        <div className={cx("load-more-container")}>
          <Button onClick={handleLoadMore} className={cx("load-more-btn")}>
            Xem thêm đánh giá
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
