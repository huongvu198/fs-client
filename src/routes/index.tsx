import {
  CartPath,
  LoginPath,
  PaymentDetailPath,
  PaymentMethodPath,
  ProductDetailPath,
  ProductsPath,
  ProfilePath,
  RegisterPath,
  ShippingDetailPath,
  UserAddressPath,
  UserOrders,
  UserPath,
  UserVouchers,
  VerifyPath,
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
const ShippingDetails = lazy(() => import("@pages/ShippingDetail"));
const PaymentMethod = lazy(() => import("@pages/PaymentMethod"));
const UserPage = lazy(() => import("@pages/User"));
const ProfilePage = lazy(() => import("@pages/User/Profile"));
const OrdersHistoryPage = lazy(() => import("@pages/User/Orders"));
const UserAddressPage = lazy(() => import("@pages/User/Address"));
const UserVouchersPage = lazy(() => import("@pages/User/Vouchers"));
const PaymentDetailPage = lazy(() => import("pages/PaymentDetail"));

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: ProductsPath,
        element: <ListProduct />,
      },
      {
        path: ProductDetailPath,
        element: <ProductDetail />,
      },
      {
        path: CartPath,
        element: <CartList />,
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: LoginPath,
        element: <Login />,
      },
      {
        path: VerifyPath,
        element: <Verify />,
      },
      {
        path: RegisterPath,
        element: <Register />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ShippingDetailPath,
        element: <ShippingDetails />,
      },
      {
        path: PaymentMethodPath,
        element: <PaymentMethod />,
      },
      {
        path: PaymentDetailPath,
        element: <PaymentDetailPage />,
      },
      {
        path: UserPath,
        element: <UserPage />,
        children: [
          {
            path: UserOrders,
            element: <OrdersHistoryPage />,
          },
          {
            path: UserVouchers,
            element: <UserVouchersPage />,
          },
          {
            path: UserAddressPath,
            element: <UserAddressPage />,
          },
          {
            path: ProfilePath,
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export default Routers;
