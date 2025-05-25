import BannerComponent from "@components/Banner";
import ProductSection from "@components/ProductCardComponent";
import StyleBannerComponent from "@components/StyleBannerComponent";
import {
  setAccessToken,
  setLocalRefreshToken,
  setLocalToken,
  setRefreshToken,
} from "@config/accessToken";
import { ApiDispatch } from "@redux/index";
import { getRefreshTokenApi } from "@redux/loginSlice";
import {
  bestSellers,
  getBestSellers,
  getNewArrivals,
  newArrivals,
} from "@redux/productSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "contexts/authContext";

const Home = () => {
  const dispatch = useDispatch<ApiDispatch>();
  const newArrivalsData = useSelector(newArrivals);
  const bestSellersData = useSelector(bestSellers);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    dispatch(getNewArrivals());
    dispatch(getBestSellers());
  }, [dispatch]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const resultAction = await dispatch(getRefreshTokenApi());

        if (getRefreshTokenApi.fulfilled.match(resultAction)) {
          const { token, refreshToken, tokenExpires, refreshExpires } =
            resultAction.payload;

          if (token && refreshToken) {
            const tokenDate = new Date((tokenExpires ?? 0) * 1000);
            const refreshDate = new Date((refreshExpires ?? 0) * 1000);
            setRefreshToken(refreshToken, refreshDate);
            setAccessToken(token, tokenDate);
            setLocalToken(token);
            setLocalRefreshToken(refreshToken);
            login();
          }
        } else {
          return;
        }
      } catch (error) {
        return;
      }
    };
    initApp();
  }, []);

  return (
    <div>
      <BannerComponent />
      <ProductSection
        navigate={navigate}
        justifyContent="center"
        isSlider={true}
        isViewAll={true}
        title="New Arrivals"
        products={newArrivalsData}
        tag="New"
      />
      <hr
        style={{ border: "1px solid #0000001A", width: "75%", margin: "auto" }}
      />
      <ProductSection
        navigate={navigate}
        justifyContent="center"
        isSlider={true}
        isViewAll={true}
        title="Top Selling"
        products={bestSellersData}
        tag="Best Seller"
      />
      <StyleBannerComponent />
      {/* <TestimonialsCarousel testimonials={testimonials} /> */}
    </div>
  );
};

export default Home;
