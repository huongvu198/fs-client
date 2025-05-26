import Sidebar from "@components/Sidebar";
import classNames from "classnames/bind";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import Nav from "@components/Nav";
import { useWindowSize } from "@hooks/useWindowSize";
import { BREAKPOINT_SCREEN } from "@constants/const";
import Footer from "@components/FooterComponent";
import { hasAccessToken } from "@config/accessToken";
import { useRedux } from "@hooks/useRedux";
import ScrollOnTop from "@components/ScrollOnTop/scrollOnTop";
import { getMasterData } from "@redux/appSlice";
import { Spin } from "antd";
import { getSegments } from "@redux/segmentSlice";

const cx = classNames.bind(styles);

const PublicLayout = () => {
  const [, setIsOpenSideBar] = useState(true);
  const sidebarRef = useRef<any>(null);
  const resize = useWindowSize();
  const navigate = useNavigate();
  const dispatch = useRedux();

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
  useEffect(() => {
    const token = hasAccessToken();
    const publicPaths = ["/login", "/register", "/verify"];

    if (token) {
      if (publicPaths.includes(location.pathname)) {
        navigate("/", { replace: true });
      }
    }
  }, [location, navigate, dispatch]);

  useEffect(() => {
    dispatch(getMasterData());
    dispatch(getSegments());
  }, [dispatch]);

  return (
    <>
      <div>
        <ScrollOnTop />
        <Nav
          handleHiddenSideBar={handleHiddenSideBar}
          handleShowSideBar={handleShowSideBar}
        />
        <div className={cx("example-layout")}>
          <Sidebar ref={sidebarRef} />
          <div className="body-layout">
            <Suspense fallback={<Spin size="large" fullscreen={true} />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;
