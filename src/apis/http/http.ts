import { xhrRequestAdapter } from "@alova/adapter-xhr";
import { Arg, createAlova } from "alova";
import vueHook from "alova/vue";

import { createLogger } from "@/logger";
import useUserStore from "@/stores/use-user-store";

import { trpcClient } from "../ipc";

const port = await trpcClient.getProxyServerPort.query();
const baseURL = `http://localhost:${port}/api`;

const { info, error } = createLogger("api");

info("baseURL: ", baseURL);

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
    (method.config.params as Arg).platform = 3;
    (method.config.params as Arg).in_mainland = true;
  },
  responded: {
    async onSuccess(response, method) {
      if (response.status >= 400 || response.data.code !== 200) {
        error(method.url, response.status, response.data);
        throw new Error(response.data.message ?? response.statusText);
      }
      info(
        method.url,
        response.status,
        import.meta.env.DEV ? response.data : "",
      );
      return response.data;
    },
  },
});

export default http;
