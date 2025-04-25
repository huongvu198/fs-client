import {
  ProductDetailPath,
  ProfilePath,
  UserAddressPath,
  UserOrders,
  UserPath,
  UserVouchers,
} from "@config/routerConfig";
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
const UserPage = lazy(() => import("@pages/User"));
const ProfilePage = lazy(() => import("@pages/User/Profile"));
const OrdersHistoryPage = lazy(() => import("@pages/User/Orders"));
const AddressPage = lazy(() => import("@pages/User/Address"));
const UserVouchersPage = lazy(() => import("@pages/User/Vouchers"));

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
          path: "/cartList",
          element: <CartList />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: UserPath,
          element: <UserPage />,
          children: [
            {
              path: ProfilePath,
              element: <ProfilePage />,
            },
            {
              path: UserOrders,
              element: <OrdersHistoryPage />,
            },
            {
              path: UserAddressPath,
              element: <AddressPage />,
            },
            {
              path: UserVouchers,
              element: <UserVouchersPage />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
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
  ]);
  return <RouterProvider router={router} />;
};

const Routers = () => <RouteComponent />;

export default Routers;
