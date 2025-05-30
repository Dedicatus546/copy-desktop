import { Config } from "@electron/module/config";

import { SystemNetwork } from "@/apis";
import { trpcClient } from "@/apis/ipc";

interface State {
  config: Config;
  network: SystemNetwork | null;
}

const useAppStore = defineStore("app", () => {
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

  const updateConfigAction = async (config: Partial<State["config"]>) => {
    Object.assign(state.config, config);
    await trpcClient.saveConfig.query(state.config);
  };

  return {
    ...toRefs(state),
    updateNetworkAction,
    updateConfigAction,
  };
});

export default useAppStore;
