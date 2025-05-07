import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setLocale } from "./config/locale";
import { ConfigProvider, notification } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux";
import { NotiContext } from "contexts/notiContext";
import Routers from "./routes";
import "./locales";
import { IntlProvider } from "react-intl";
import { CartProvider } from "contexts/cartContext";
import { AuthProvider } from "contexts/authContext";
const App = () => {
  const {
    i18n: { changeLanguage },
  } = useTranslation();

  useEffect(() => {
    setLocale("vn");
    changeLanguage("vn");
  }, []);

  const [api, contextHolder] = notification.useNotification();

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#000000",
          },
          components: {},
        }}
      >
        <AuthProvider>
          <CartProvider>
            <NotiContext api={api} contextHolder={contextHolder}>
              <IntlProvider locale="vi-VN">
                <Routers />
              </IntlProvider>
            </NotiContext>
          </CartProvider>
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
