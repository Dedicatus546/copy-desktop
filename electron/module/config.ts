import { existsSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { emitter } from "@electron/shared/mitt";
import { dataDir } from "@electron/shared/path";
import { clone } from "radash";

export type Theme = "light" | "dark" | "auto";
export type ReadMode = "scroll" | "click";
export type WindowInfo = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type ProxyInfo = {
  host: string;
  port: number;
  username: string;
  password: string;
};
export type Config = {
  theme: Theme;
  apiUrl: string;
  apiUrlList: Array<string>;
  downloadDir: string;
  readMode: ReadMode;
  autoLogin: boolean;
  loginUserInfo: string;
  zoomFactor: number;
  windowInfo?: WindowInfo | undefined;
  proxyInfo?: ProxyInfo | undefined;
};

export const configFilepath = resolve(dataDir, "config.json");

export const defaultConfig: Config = {
  theme: "light",
  apiUrl: "https://api.mangacopy.com/api/v3",
  apiUrlList: [
    "https://api.copy2000.online/api/v3",
    "https://api.mangacopy.com/api/v3",
  ],
  downloadDir: "",
  readMode: "scroll",
  autoLogin: false,
  loginUserInfo: "",
  zoomFactor: 1.0,
  windowInfo: undefined,
  proxyInfo: undefined,
};

let config: Config;

if (!existsSync(configFilepath)) {
  config = clone(defaultConfig);
  writeFileSync(configFilepath, JSON.stringify(config, undefined, 2));
}

export const getConfig = async () => {
  if (config) {
    return config;
  }
  const str = await readFile(configFilepath, { encoding: "utf-8" });
  config = JSON.parse(str) as Config;
  return config;
};

export const saveConfig = async (newConfig: Config) => {
  const oldConfig = config;
  config = clone(newConfig);
  await writeFile(configFilepath, JSON.stringify(config, undefined, 2));
  emitter.emit("configChange", [config, oldConfig]);
};
