import { useNavigate } from "react-router-dom";
import MenuComponent from "@components/MenuComponent";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ButtonComponent from "@components/ButtonComponent";
import ProductSection from "@components/ProductCardComponent";
import PaginationComponent from "@components/PaginationComponent";
import { useEffect, useState, useCallback } from "react";
import useQuery from "@hooks/useQuery";
import { getProductWithCondition } from "@redux/productSlice";
import { useRedux, useReduxSelector } from "@hooks/useRedux";
import { ProductsQueryPath } from "@config/routerConfig";

const cx = classNames.bind(styles);

const ListProduct = () => {
  const navigate = useNavigate();
  const dispatch = useRedux();
  const { products, pagination } = useReduxSelector(
    (state: any) => state.product
  );
  const { masterData } = useReduxSelector((state: any) => state.app);

  const [colors, setColors] = useState<{ code: string; name: string }[]>([]);
  const [shirtSizes, setShirtSizes] = useState<
    { key: string; value: string }[]
  >([]);
  const [pantsSizes, setPantsSizes] = useState<
    { key: string; value: string }[]
  >([]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tag, setTag] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const query = useQuery();

  useEffect(() => {
    if (masterData?.colors) setColors(masterData.colors);
    if (masterData?.shirtSizes) setShirtSizes(masterData.shirtSizes);
    if (masterData?.pantsSizes) setPantsSizes(masterData.pantsSizes);
  }, [masterData]);

  useEffect(() => {
    const queryTag = query.get("tag");
    const querySearch = query.get("search");

    setTag(queryTag);
    setSearch(querySearch);

    if (queryTag || querySearch) {
      const filterConditions: any = {
        page: 1,
        perPage: 12,
      };
      if (querySearch) {
        filterConditions.search = querySearch;
      } else if (queryTag) {
        filterConditions.tag = queryTag;
      }
      dispatch(getProductWithCondition(filterConditions));
    }
  }, [query, dispatch]);

  const handleFilter = useCallback(
    (page = 1, perPage = 12) => {
      const filterConditions: any = {
        page,
        perPage,
      };

      if (selectedSizes.length > 0) filterConditions.size = selectedSizes;
      if (selectedColors.length > 0) filterConditions.color = selectedColors;

      const queryParams: { search?: string; tag?: string } = {};

      if (search) {
        filterConditions.search = search;
        queryParams.search = search;
      } else if (tag) {
        filterConditions.tag = tag;
        queryParams.tag = tag;
      }

      const queryPath = ProductsQueryPath(queryParams);
      navigate(queryPath, { replace: true });

      dispatch(getProductWithCondition(filterConditions));
    },
    [selectedSizes, selectedColors, search, tag, dispatch, navigate]
  );

  const handleSizeSelect = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorSelect = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleChange = (page: number, pageSize?: number) => {
    handleFilter(page, pageSize);
  };

  const handleClearFilter = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearch(null);
    setTag(null);
    navigate("/products", { replace: true });

    dispatch(
      getProductWithCondition({
        page: 1,
        perPage: 12,
      })
    );
  };

  const menuItems = [
    {
      key: "size",
      label: "Kích cỡ",
      children: [
        {
          key: "shirt-size-menu",
          label: (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {shirtSizes.map(({ key, value }) => (
                <ButtonComponent
                  key={key}
                  className={cx("size-button-menu", {
                    selected: selectedSizes.includes(key),
                  })}
                  onClick={() => handleSizeSelect(key)}
                >
                  {value}
                </ButtonComponent>
              ))}
            </div>
          ),
        },
        {
          key: "pants-size-menu",
          label: (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {pantsSizes.map(({ key, value }) => (
                <ButtonComponent
                  key={key}
                  className={cx("size-button-menu", {
                    selected: selectedSizes.includes(key),
                  })}
                  onClick={() => handleSizeSelect(key)}
                >
                  {value}
                </ButtonComponent>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      key: "color",
      label: "Màu sắc",
      children: [
        {
          key: "color-options",
          label: (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {colors.map(({ code }) => (
                <div
                  key={code}
                  onClick={() => handleColorSelect(code)}
                  className={cx("color-circle", {
                    selected: selectedColors.includes(code),
                  })}
                  style={{
                    backgroundColor: code,
                    border:
                      code.toLowerCase() === "#ffffff"
                        ? "1px solid #ccc"
                        : undefined,
                  }}
                  data-color={code.toLowerCase()}
                />
              ))}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className={cx("list-product-container")}>
      <section className={cx("section-list-product")}>
        <div className={cx("menu-container")}>
          <h2 className={cx("menu-title")}>Lọc sản phẩm</h2>
          <hr />
          <MenuComponent items={menuItems} selectedKey={"size"} />
          <div className={cx("filter-button-container")}>
            <ButtonComponent
              htmlType="button"
              className={cx("menu-filter-button")}
              onClick={() => handleFilter()}
            >
              Áp dụng
            </ButtonComponent>
          </div>
          <div
            className={cx("filter-button-container")}
            style={{ marginTop: 8 }}
          >
            {(search ||
              tag ||
              selectedColors.length > 0 ||
              selectedSizes.length > 0) && (
              <ButtonComponent
                htmlType="button"
                className={cx("menu-clear-filter-button")}
                onClick={handleClearFilter}
              >
                Xóa bộ lọc
              </ButtonComponent>
            )}
          </div>
        </div>
        <div className={cx("content-container")}>
          <h1 style={{ marginTop: 0 }}>DANH SÁCH SẢN PHẨM</h1>
          <div className={cx("product-card-container")}>
            <ProductSection
              justifyContent="flex-start"
              isViewAll={false}
              isSlider={false}
              products={products}
              navigate={navigate}
            />
          </div>
          <div className={cx("pagination-container")}>
            <PaginationComponent
              pagination={pagination}
              onPageChange={handleChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListProduct;
