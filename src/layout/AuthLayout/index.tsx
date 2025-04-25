import { hasAccessToken } from "@config/accessToken";
import { useEffect, useState, Suspense, useLayoutEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@components/Sidebar";
import Spinner from "@components/Spinner";
import Nav from "@components/Nav";
import { useWindowSize } from "@hooks/useWindowSize";
import { BREAKPOINT_SCREEN } from "@constants/const";
import Footer from "@components/FooterComponent";
import ScrollOnTop from "@components/ScrollOnTop/scrollOnTop";

const AuthLayout = () => {
  const [, setIsOpenSideBar] = useState(true);
  const sidebarRef = useRef<any>(null);
  const resize = useWindowSize();
  const navigate = useNavigate();

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
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <div>
        <ScrollOnTop />
        <Nav
          handleHiddenSideBar={handleHiddenSideBar}
          handleShowSideBar={handleShowSideBar}
        />
        <div>
          <Sidebar ref={sidebarRef} />
          <div>
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

export default AuthLayout;
