import { xhrRequestAdapter } from "@alova/adapter-xhr";
import { createAlova } from "alova";
import vueHook from "alova/vue";

import useUserStore from "@/stores/use-user-store";

const http = createAlova({
  statesHook: vueHook,
  requestAdapter: xhrRequestAdapter({}),
  baseURL: "https://api.mangacopy.com/api/v3",
  beforeRequest(method) {
    const userStore = useUserStore();
    if (userStore.isLogin) {
      method.config.headers.authorization = `Token ${userStore.userInfo!.token}`;
    }
    // method.config.headers.referer = "com.copymanga.app-2.2.5";
    method.config.headers.version = "2.2.5";
    method.config.headers.region = 1;
    // method.config.headers.device = 1;
    method.config.params.platform = 3;
    method.config.params.in_mainland = true;
    // method.config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    // method.config.headers.tokenparam = `${ts},${version}`;
    // method.config.headers.token = tokenHash;
  },
  responded: {
    async onSuccess(response, method) {
      if (response.status >= 400) {
        throw new Error(response.data.errorMsg ?? response.statusText);
      }
      const json = response.data;
      if (json.code !== 200) {
        throw new Error(json.message);
      }
      console.log(method.url, response.status, json);
      return json;
    },
  },
});

export default http;
