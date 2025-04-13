import Sidebar from "@components/Sidebar";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import Spinner from "@components/Spinner";
import Nav from "@components/Nav";
import { useWindowSize } from "@hooks/useWindowSize";
import { BREAKPOINT_SCREEN } from "@constants/const";

const cx = classNames.bind(styles);

const ExampleLayout = () => {
  const [, setIsOpenSideBar] = useState(true);
  const sidebarRef = useRef<any>(null);
  const resize = useWindowSize();
  const handleShowSideBar = () => {
    setIsOpenSideBar(true);
    sidebarRef.current?.showDrawer();
  };
  const handleHiddenSideBar = () => {
    setIsOpenSideBar(false);
    sidebarRef.current?.closeDrawer();
  };

  useLayoutEffect(() => {
    if (window.innerWidth > BREAKPOINT_SCREEN.lg) {
      setIsOpenSideBar(false);
    }
  }, [resize]);
  return (
    <div>
      <Nav
        handleHiddenSideBar={handleHiddenSideBar}
        handleShowSideBar={handleShowSideBar}
      />
      <div className={cx("example-layout")}>
        <Sidebar ref={sidebarRef} />
        <div className="body-layout">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ExampleLayout;
