import { Agent, Server } from "node:http";
import { AddressInfo } from "node:net";
import { join } from "node:path";

import { distElectron } from "@electron/shared/path";
import { resolveProxyUrl } from "@electron/shared/utils";
import cors from "cors";
import { format } from "date-fns";
import Express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { HttpsProxyAgent } from "https-proxy-agent";

import { getConfig } from "./config";

const config = await getConfig();

let agent: Agent | undefined;
const proxyUrl = resolveProxyUrl(config.proxyInfo);
if (proxyUrl) {
  agent = new HttpsProxyAgent(proxyUrl);
}

const proxyExpress = Express();
proxyExpress.use(cors());

proxyExpress.use(
  "/api",
  (req, _res, _next) => {
    req.headers["user-agent"] = "COPY/2.3.0";
    req.headers.source = "copyApp";
    // mumu 模拟器设备
    req.headers.deviceinfo = "2206123SC-mayfly";
    req.headers.device = "V417IR";
    req.headers.webp = "1";
    req.headers.platform = "3";
    req.headers.dt = format(new Date(), "yyyy.MM.dd");
    req.headers.referer = "com.copymanga.app-2.3.0";
    req.headers.region = "1";
    req.headers.version = "2.3.0";
    // TODO 未知参数
    req.headers.umstring = "b4c89ca4104ea9a97750314d791520ac";
    console.log("req.headers:", req.headers);
    _next();
  },
  createProxyMiddleware({
    target: config.apiUrl,
    agent,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/api": "",
    },
  }),
);

// TODO 生产环境下启用
// vue 路由
proxyExpress.get("/:rest", (_req, res) => {
  res.sendFile(join(distElectron, "index.html"));
});

let proxyServer: Server | undefined;
const proxyServerInitPromise = new Promise<void>((resolve, reject) => {
  const devServerUrl = process.env["VITE_DEV_SERVER_URL"];
  const port = devServerUrl ? 6174 : 0;
  proxyServer = proxyExpress.listen(port, () => {
    resolve();
  });

  proxyServer.on("error", (err) => {
    reject(err);
  });
});

export const getProxyServerPort = async () => {
  if (!proxyServer) {
    return;
  }
  await proxyServerInitPromise;
  const address = proxyServer.address() as AddressInfo;
  return address.port;
};

export const closeProxyServer = () => {
  proxyServer?.close();
};
