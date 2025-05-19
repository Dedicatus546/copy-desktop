import { useRequest } from "alova/client";
import { isString } from "radash";

import { getSystemNetWorkApi, loginApi } from "@/apis";
import logger from "@/logger";
import useAppStore from "@/stores/use-app-store";
import useUserStore from "@/stores/use-user-store";
import { delay } from "@/utils";

import useDecodeUserInfo from "./use-decode-user-info";

const useInitNetwork = () => {
  const appStore = useAppStore();
  const { data, onSuccess, send } = useRequest(() => getSystemNetWorkApi(), {
    immediate: false,
  });
  onSuccess(() => {
    appStore.updateNetworkAction(data.value.results);
  });

  return {
    init: async () => {
      return send().catch(() => {
        throw new Error("读取网络配置失败");
      });
    },
  };
};

// const useInitConfig = () => {
//   const appStore = useAppStore();
//   const { data, onSuccess, invoke } = useIpcRendererInvoke<Config>(
//     () => getConfigIpc(),
//     {
//       immediate: false,
//     },
//   );
//   const { invoke: updateConfigInvoke } = useIpcRendererInvoke(
//     (shuntKey: number) => updateConfigIpc({ currentShuntKey: shuntKey }),
//     {
//       immediate: false,
//     },
//   );

//   onSuccess(() => {
//     appStore.updateConfigAction(data.value!);
//     if (appStore.setting.shuntList.length > 0) {
//       if (
//         // 第一次启动未选择图源
//         appStore.config.currentShuntKey === undefined ||
//         // 接口的图源列表可能发生变化，回退到第一个图源
//         appStore.setting.shuntList.every(
//           (item) => item.key !== appStore.config.currentShuntKey,
//         )
//       ) {
//         appStore.updateConfigAction({
//           currentShuntKey: appStore.setting.shuntList[0].key,
//         });
//         updateConfigInvoke(appStore.config.currentShuntKey);
//       }
//     }
//   });

//   return {
//     init: async () => {
//       return invoke().catch(() => {
//         throw new Error("读取应用设置失败");
//       });
//     },
//   };
// };

const useAutoLogin = () => {
  const userStore = useUserStore();
  const appStore = useAppStore();
  let username = "",
    password = "";
  const { send, onSuccess, data } = useRequest(
    (username: string, password: string) => loginApi({ username, password }),
    {
      immediate: false,
    },
  );
  const { decrypt } = useDecodeUserInfo();
  onSuccess(() => {
    userStore.updateUserInfoAction(data.value.results);
    userStore.updateLoginInfoAction(username, password);
  });

  return {
    init: async () => {
      // const loginInfo = decrypt(appStore.config.loginUserInfo);
      if (import.meta.env.DEV) {
        username = import.meta.env.VITE_LOGIN_USERNAME;
        password = import.meta.env.VITE_LOGIN_PASSWORD;
      }
      return send(username, password).catch(() => {
        logger.error("自动登录失败，跳过");
      });
    },
  };
};

const useInitApp = () => {
  const appStore = useAppStore();
  const networkJob = useInitNetwork();
  // const setting = useInitSetting();
  // const config = useInitConfig();
  const autoLoginJob = useAutoLogin();
  // TODO
  const loading = ref(false);
  const currentStatus = ref<string | null>(null);
  const error = ref<string | null>(null);

  const init = async () => {
    loading.value = true;
    error.value = null;
    try {
      currentStatus.value = "获取网络设置";
      await networkJob.init();
      await delay(300);
      // currentStatus.value = "获取应用配置";
      // await config.init();
      // await delay(300);
      // TODO
      if (true) {
        // if (appStore.config.autoLogin && appStore.config.loginUserInfo) {
        currentStatus.value = "自动登录";
        await autoLoginJob.init();
        await delay(300);
      }
    } catch (e) {
      if (isString(e)) {
        error.value = e;
      } else if (e instanceof Error) {
        error.value = e.message;
      }
    }
    loading.value = false;
  };

  onMounted(() => {
    init();
  });

  return {
    currentStatus,
    loading,
    error,
    init,
  };
};

export default useInitApp;
