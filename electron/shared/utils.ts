import { access } from "node:fs/promises";

import { ProxyInfo } from "@electron/module/config";

export const resolveProxyUrl = (proxyInfo?: ProxyInfo) => {
  if (!proxyInfo) {
    return undefined;
  }
  const { host, port, username, password } = proxyInfo;
  const url = new URL(`http://${host}:${port}`);
  url.username = username;
  url.password = password;
  // 去除末尾斜杠
  return url.toString().slice(0, -1);
};

export const delay = async (timeout = 2000) => {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, timeout);
  return promise;
};

export const shouldRestartProxyServer = (
  newProxyInfo?: ProxyInfo,
  oldProxyInfo?: ProxyInfo,
) => {
  if (!oldProxyInfo && !newProxyInfo) {
    return false;
  }
  if ((!oldProxyInfo && newProxyInfo) || (oldProxyInfo && !newProxyInfo)) {
    return true;
  }
  if (
    oldProxyInfo?.host === newProxyInfo?.host &&
    oldProxyInfo?.port === newProxyInfo?.port &&
    oldProxyInfo?.username === newProxyInfo?.username &&
    oldProxyInfo?.password === newProxyInfo?.password
  ) {
    return false;
  }
  return true;
};

export const exists = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
