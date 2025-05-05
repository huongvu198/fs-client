import { createContext, useContext, useEffect, useState } from "react";
import { ICartResponse } from "interfaces/cart.interface"; // đảm bảo ICartItem đã có
import { hasAccessToken, hasLocalAccessToken } from "@config/accessToken";

interface CartContextType {
  cart: ICartResponse | null;
  setCart: React.Dispatch<React.SetStateAction<ICartResponse | null>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<ICartResponse | null>(null);

  useEffect(() => {
    const hasToken = hasAccessToken() && hasLocalAccessToken();

    if (hasToken) {
      const storedCart = localStorage.getItem("cartList");
      const storedTempCart = localStorage.getItem("tempCart");

      let parsedCart: ICartResponse = { id: "", items: [] };

      if (storedCart) {
        try {
          parsedCart = JSON.parse(storedCart);
        } catch (error) {
          console.error("Lỗi parse cartList", error);
        }
      }

      if (storedTempCart) {
        try {
          const tempCart = JSON.parse(storedTempCart) as ICartResponse;
          parsedCart.items = [...parsedCart.items, ...tempCart.items];
          localStorage.removeItem("tempCart"); // Xóa tempCart sau khi merge
        } catch (error) {
          console.error("Lỗi parse tempCart", error);
        }
      }

      setCart(parsedCart);
    } else {
      const storedTempCart = localStorage.getItem("tempCart");
      if (storedTempCart) {
        try {
          setCart(JSON.parse(storedTempCart));
        } catch (error) {
          console.error("Lỗi parse tempCart", error);
          setCart({ id: "", items: [] } as ICartResponse);
        }
      } else {
        setCart({ id: "", items: [] } as ICartResponse);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
