import { getProxyServerPort } from "@electron/module/proxy-server";

import { trpc } from "./trpc";

const getProxyServerPortRpc = trpc.procedure.query(async () => {
  return getProxyServerPort();
});

export const router = {
  getProxyServerPort: getProxyServerPortRpc,
};
