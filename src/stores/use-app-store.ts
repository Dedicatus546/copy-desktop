import { SystemNetwork } from "@/apis";
import { Config } from "@/types/base";

interface State {
  config: Config;
  network: SystemNetwork | null;
}

const useAppStore = defineStore("app", () => {
  const state = reactive<State>({
    config: {
      mode: "light",
      apiUrl: "",
      downloadDir: "",
      readMode: 1,
      currentShuntKey: undefined,
      autoLogin: false,
      loginUserInfo: "",
      proxy: undefined,
    },
    network: null,
  });

  const updateNetworkAction = (network: Partial<State["network"]>) => {
    state.network = Object.assign({}, state.network, network);
  };

  const updateConfigAction = (config: Partial<State["config"]>) => {
    Object.assign(state.config, config);
  };

  return {
    ...toRefs(state),
    updateNetworkAction,
    updateConfigAction,
  };
});

export default useAppStore;
