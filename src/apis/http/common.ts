import http from "./http";
import { RespWrapper, SystemNetwork } from "./type";

export const getSystemNetWorkApi = () => {
  return http.Get<RespWrapper<SystemNetwork>>("system/network2");
};
