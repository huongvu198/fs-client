import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./translation/en.json";

const resources = {
  en: { translation: translationEN },
};

i18next.use(initReactI18next).init({
  lng: "en",
  debug: true,
  resources,
});
