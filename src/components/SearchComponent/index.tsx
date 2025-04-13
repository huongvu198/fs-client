import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import classNames from "classnames/bind";
import { KeyboardEventHandler, useState } from "react";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
  onPressEnter?: KeyboardEventHandler<HTMLInputElement> | undefined
}

const SearchComponent = ({ onSearch, placeholder }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const handleSearch = () => {
    setIsMobileSearchOpen(false);
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
    setSearchValue("")
  };

  return (
    <div className={cx("search-container", { open: isMobileSearchOpen })}>
      {/* Desktop: Input with left icon */}
      <div className={cx("search-desktop")}>
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined className={cx("search-icon")}/>}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          className={cx("input-search-component")}
        />
      </div>

      {/* Mobile: icon search */}
      <div className={cx("search-mobile")}>
        {!isMobileSearchOpen ? (
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setIsMobileSearchOpen(true)}
          />
        ) : (
          <div className={cx("search-dropdown")}>
            <Input
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsMobileSearchOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
