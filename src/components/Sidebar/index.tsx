  import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
  import Spinner from "@components/Spinner";
  import {
    BREAKPOINT_SCREEN,
    DATA_SIDEBAR,
    ICONS_NAV,
    WIDTH_SIDE_BAR_PC,
    WIDTH_SIDE_BAR_SP,
  } from "@constants/const";
  import { Button, Menu, type MenuProps } from "antd";
  import classNames from "classnames/bind";
  import { useEffect, useRef, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import styles from "./index.module.scss";

  const cx = classNames.bind(styles);
  type MenuItem = Required<MenuProps>["items"][number];
  interface Props {
    isOpenSidebar: boolean;
    setIsOpenSidebar: (isOpen: boolean) => void | undefined;
  }

  const renderIcon = (iconName: string) => ICONS_NAV[iconName] || null;
  const Sidebar = ({ isOpenSidebar, setIsOpenSidebar }: Props) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState<MenuItem[]>([]);
    const onClick: MenuProps["onClick"] = (e) => {
      navigate(e.key);
    };

    const dataSidebar = DATA_SIDEBAR;
    const toggleCollapsed = () => {
      setIsOpenSidebar(false);
    };

    useEffect(() => {
      if (window.innerWidth < BREAKPOINT_SCREEN.lg) {
        setIsOpenSidebar(false);
      }
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!sidebarRef.current?.contains(e.target as Node))
          setIsOpenSidebar(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (dataSidebar) {
        const convertMenu = dataSidebar.map((menu) => ({
          key: menu.slug,
          label: menu.label,
        }));
        setItems(convertMenu);
      }
    }, [dataSidebar]);


    return (
      <div
        className={cx("sidebar-wrapper", { hidden: !isOpenSidebar })}
      >
        <Spinner isLoading={false}>
          <div
            ref={sidebarRef}
            className={`sidebar-component`}
            style={{ width: collapsed ? WIDTH_SIDE_BAR_SP : WIDTH_SIDE_BAR_PC }}
          >
            <Menu
              onClick={onClick}
              defaultSelectedKeys={[location.pathname]}
              mode="inline"
              items={items}
              inlineCollapsed={collapsed}
            />
            <div className="group-btn-bottom">
              <Button
                type="text"
                onClick={toggleCollapsed}
                style={{ marginBottom: 8 }}
              >
                {<MenuFoldOutlined />}
              </Button>
            </div>
          </div>
        </Spinner>
      </div>
    );
  };

  export default Sidebar;
