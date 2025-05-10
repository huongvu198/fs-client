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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "contexts/authContext";
const bannerProps = {
  title: "FIND CLOTHES THAT MATCHES YOUR STYLE",
  subTitle:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  buttonText: "Shop Now",
  stats: [
    { value: 0, label: "International Brands" },
    { value: 0, label: "High-Quality Products" },
    { value: 0, label: "Happy Customers" },
  ],
  imgSrc:
    "https://s3-alpha-sig.figma.com/img/b26f/ea69/ccfd8aa5825862cdb9604a4fb4930464?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Lim80RmWzpvPYiZcu~9~3V~wSgGzBFH-Ssd2Qf-U691cxKG6VyUDsf6aDXKL4-rITE~lPAWhsBzqc~JGW6VDCEltolfSu0~Rw62SquZ8Yy75rM13Uj9t8Hn4DfXemzzz3wVCxDsu8vVqEWMKc-sU3B6AFRrBZtX1YwT3cuILmy8uivP6D~5AA0bTlFcDlS7i4Pz~IE0R597IBx0OfMWEgVEJ1YVQvthRa2KXvK~pMOSH2M0Jv1LXYwhnz8rvcuLmEfHmMFSrAL-19MDmUTOQrY6xY~ZvC1SCB8F2Noj0ep5Hmvna1Jk-Y494y5XYOWzA4fLpOcWGX7HZ1rXyTj62Lw__",
};

const Home = () => {
  const [stats, setStats] = useState(bannerProps.stats);
  const dispatch = useDispatch<ApiDispatch>();
  const newArrivalsData = useSelector(newArrivals);
  const bestSellersData = useSelector(bestSellers);
  const navigate = useNavigate();
  const { login } = useAuthContext();
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 8) + 3,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!newArrivalsData.length || !bestSellersData.length) {
      dispatch(getNewArrivals());
      dispatch(getBestSellers());
    }
  }, [dispatch, newArrivalsData, bestSellersData]);

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
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        navigate("/login");
      }
    };
    initApp();
  }, []);

  return (
    <div>
      <BannerComponent {...bannerProps} stats={stats} />
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
