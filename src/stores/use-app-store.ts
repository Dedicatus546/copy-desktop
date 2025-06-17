import { Config } from "@electron/module/config";
import { useTheme } from "vuetify";

import { SystemNetwork } from "@/apis";
import { trpcClient } from "@/apis/ipc";

interface State {
  config: Config;
  network: SystemNetwork | null;
}

const useAppStore = defineStore("app", () => {
  const theme = useTheme();
  const isDark = usePreferredDark();
  const state = reactive<State>({
    config: {
      theme: "light",
      apiUrl: "",
      downloadDir: "",
      readMode: "scroll",
      autoLogin: false,
      loginUserInfo: "",
      proxyInfo: undefined,
      apiUrlList: [],
      zoomFactor: 0,
      windowInfo: undefined,
    },
    network: null,
  });

  const updateNetworkAction = (network: Partial<State["network"]>) => {
    state.network = Object.assign({}, state.network, network);
  };

  const updateConfigAction = async (
    config: Partial<State["config"]>,
    sync = false,
  ) => {
    if (config.theme) {
      if (config.theme === "auto") {
        theme.global.name.value = isDark.value ? "dark" : "light";
      } else {
        theme.global.name.value = config.theme;
      }
    }
    state.config = {
      ...state.config,
      ...config,
    };
    if (sync) {
      await trpcClient.saveConfig.query(state.config);
    }
  };

  watch(isDark, (isDark) => {
    if (state.config.theme === "auto") {
      theme.global.name.value = isDark ? "dark" : "light";
    }
  });

  return {
    ...toRefs(state),
    updateNetworkAction,
    updateConfigAction,
  };
});

export default useAppStore;
