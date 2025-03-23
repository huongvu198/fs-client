import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setLocale } from "./config/locale";
import { ConfigProvider, notification } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux";
import { NotiContext } from "contexts/notiContext";
import Routers from "./routes";
import "./locales"
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
          components: {
          },
        }}
      >
        <NotiContext api={api} contextHolder={contextHolder}>
          <Routers />
        </NotiContext>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
