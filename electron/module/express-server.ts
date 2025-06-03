import { Agent, Server } from "node:http";
import { AddressInfo } from "node:net";
import { join } from "node:path";

import { distElectron, distRenderer } from "@electron/shared/path";
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

const express = Express();
express.use(cors());
express.use("/", Express.static(distRenderer));

express.use(
  "/api",
  (req, _res, next) => {
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
    req.headers.umstring = "b4c89ca4104ea9a97750314d791520ac";
    next();
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

// vue 路由
express.get("/:rest", (_req, res) => {
  res.sendFile(join(distElectron, "index.html"));
});

let expressServer: Server | undefined;
let expressServerInitPromise: Promise<void> | undefined;

export const getExpressServerPort = async () => {
  if (!expressServer) {
    return;
  }
  await expressServerInitPromise;
  const address = expressServer.address() as AddressInfo;
  return address.port;
};

export const closeExpressServer = async () => {
  return new Promise<void>((resolve, reject) => {
    expressServer?.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      expressServer = undefined;
      expressServerInitPromise = undefined;
      resolve();
    });
  });
};

export const startExpressServer = async () => {
  const lastServerPort = await getExpressServerPort();
  if (expressServer) {
    await closeExpressServer();
  }
  expressServerInitPromise = new Promise<void>((resolve, reject) => {
    const devServerUrl = process.env["VITE_DEV_SERVER_URL"];
    const port = devServerUrl ? 6174 : (lastServerPort ?? 0);
    expressServer = express.listen(port, () => {
      resolve();
    });

    expressServer.on("error", (err) => {
      reject(err);
    });
  });
};

startExpressServer();
