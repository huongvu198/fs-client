import PublicLayout from "@layout/PublicLayout";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import page
const Home = lazy(() => import("@pages/Home"));
const ListProduct = lazy(() => import("@pages/ListProduct"));
const ProductDetail = lazy(() => import("@pages/ProductDetail"))
const CartList = lazy(() => import("@pages/CartList"))
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
          path: "/productDetail",
          element: <ProductDetail />,
        },
        {
          path: "/cartList",
          element: <CartList />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

const Routers = () => <RouteComponent />;

export default Routers;
