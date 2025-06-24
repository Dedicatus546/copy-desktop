import "@mdi/font/css/materialdesignicons.css";
import "swiper/swiper-bundle.css";
import "typeface-roboto";
import "uno.css";
import "vuetify/styles";
import "./style.css";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { Intersect } from "vuetify/directives";

import { trpcClient } from "./apis/ipc";
import App from "./App.vue";
import { createLogger } from "./logger";
import router from "./router";
import pinia from "./store";

const { error, info } = createLogger("main");

const isDark = usePreferredDark();
info("获取一次应用配置，用于设置 vuetify 主题");
const config = await trpcClient.getConfig.query();

const vuetify = createVuetify({
  theme: {
    defaultTheme:
      config.theme === "auto"
        ? isDark.value
          ? "dark"
          : "light"
        : config.theme,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#1e90ff",
          "on-primary": "#ffffff",
          "read-bg": "#FFFEEB",
          "read-text": "#121212",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#15599c",
          "on-primary": "#ffffff",
          "read-bg": "#363636",
          "read-text": "#b5b5b5",
        },
      },
    },
  },
  directives: {
    Intersect,
  },
});

const app = createApp(App);

app.config.errorHandler = (err) => {
  error(`vue 全局错误捕获钩子`, err);
  throw err;
};

app.config.performance = true;

app.use(vuetify).use(pinia).use(router);

app.mount("#root");
