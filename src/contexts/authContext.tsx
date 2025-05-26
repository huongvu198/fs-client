import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { hasAccessToken } from "@config/accessToken";
import { useSelector } from "react-redux";
import { getLoginSuccess } from "@redux/loginSlice";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginSucess = useSelector(getLoginSuccess);

  useEffect(() => {
    setIsAuthenticated(hasAccessToken());
  }, [loginSucess]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
