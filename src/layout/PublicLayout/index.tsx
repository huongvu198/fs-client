import Sidebar from "@components/Sidebar";
import classNames from "classnames/bind";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import Spinner from "@components/Spinner";
import Nav from "@components/Nav";
import { useWindowSize } from "@hooks/useWindowSize";
import { BREAKPOINT_SCREEN } from "@constants/const";
import Footer from "@components/FooterComponent";
import { hasAccessToken } from "@config/accessToken";
import { useRedux, useReduxSelector } from "@hooks/useRedux";
import { getUserApi } from "@redux/userSlice";
import ScrollOnTop from "@components/ScrollOnTop/scrollOnTop";

const cx = classNames.bind(styles);

const PublicLayout = () => {
  const [, setIsOpenSideBar] = useState(true);
  const sidebarRef = useRef<any>(null);
  const resize = useWindowSize();
  const navigate = useNavigate();
  const dispatch = useRedux();
  const { data, getUserSuccess } = useReduxSelector((state) => state.getUser);
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
      
      if (!getUserSuccess) {
        dispatch(getUserApi());
      }

      if (publicPaths.includes(location.pathname)) {
        navigate("/", { replace: true });
      }
    }
  }, [location, navigate, dispatch, getUserSuccess]);

  return (
    <>
      <div>
        <ScrollOnTop/>
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
      <Footer />
    </>
  );
};

export default PublicLayout;
