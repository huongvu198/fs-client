import Sidebar from "@components/Sidebar";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import Spinner from "@components/Spinner";
import Nav from "@components/Nav";
import { useWindowSize } from "@hooks/useWindowSize";
import { BREAKPOINT_SCREEN } from "@constants/const";

const cx = classNames.bind(styles);

const ExampleLayout = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const resize = useWindowSize();
  const handleShowSideBar = () => {
    setIsOpenSideBar(true);
  };
  const handleHiddenSideBar = () => {
    setIsOpenSideBar(false);
  };

  useLayoutEffect(() => {
    if (window.innerWidth > BREAKPOINT_SCREEN.lg) {
      setIsOpenSideBar(false);
    }
  }, [resize]);
  return (
    <div>
      <Nav
        isOpenSideBar={isOpenSideBar}
        handleHiddenSideBar={handleHiddenSideBar}
        handleShowSideBar={handleShowSideBar}
      />
      <div className={cx("example-layout")}>
        <Sidebar isOpenSidebar={isOpenSideBar} setIsOpenSidebar={handleHiddenSideBar}/>
        <div className='body-layout'>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ExampleLayout;
