import { ProductDetailPath } from "@config/routerConfig";
import AuthLayout from "@layout/AuthLayout";
import PublicLayout from "@layout/PublicLayout";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import page
const Home = lazy(() => import("@pages/Home"));
const ListProduct = lazy(() => import("@pages/ListProduct"));
const ProductDetail = lazy(() => import("@pages/ProductDetail"));
const CartList = lazy(() => import("@pages/CartList"));
const Login = lazy(() => import("@pages/Login"));
const Verify = lazy(() => import("@pages/VerifyEmail"));
const Register = lazy(() => import("@pages/Register"));
const ShippingDetails = lazy(() => import("@pages/ShippingDetail"));
const PaymentMethod = lazy(() => import("@pages/PaymentMethod"));
const RouteComponent = () => {
  const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/category",
          element: <ListProduct />,
        },
        {
          path: ProductDetailPath,
          element: <ProductDetail />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/cartList",
          element: <CartList />,
        },
        {
          path: "/verify",
          element: <Verify />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/shippingDetails",
          element: <ShippingDetails />,
        },
        {
          path: "/paymentMethod",
          element: <PaymentMethod />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

const Routers = () => <RouteComponent />;

export default Routers;
