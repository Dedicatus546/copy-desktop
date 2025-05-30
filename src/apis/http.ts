import { xhrRequestAdapter } from "@alova/adapter-xhr";
import { createAlova } from "alova";
import vueHook from "alova/vue";

import useUserStore from "@/stores/use-user-store";

import { trpcClient } from "./ipc";

const port = await trpcClient.getProxyServerPort.query();
const baseURL = `http://localhost:${port}/api`;
console.log("baseURL: ", baseURL);

const http = createAlova({
  statesHook: vueHook,
  requestAdapter: xhrRequestAdapter({}),
  baseURL,
  beforeRequest(method) {
    const userStore = useUserStore();
    if (userStore.isLogin) {
      method.config.headers.authorization = `Token ${userStore.userInfo!.token}`;
    }
    // method.config.headers.version = "2.3.0";
    // method.config.headers.region = 1;
    // method.config.headers.device = "V417IR";
    method.config.params.platform = 3;
    // method.config.params.in_mainland = true;
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
