import { existsSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { z } from "zod";

import { dataDir } from "../shared/path";
import { trpc } from "./trpc";

export type Theme = "light" | "dark";
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
  downloadDir: string;
  readMode: ReadMode;
  autoLogin: boolean;
  loginUserInfo: string;
  zoomFactor: number;
  windowInfo: WindowInfo | undefined;
  proxyInfo: ProxyInfo | undefined;
};

const configFilepath = resolve(dataDir, "config.json");

const initConfig: Config = {
  theme: "light",
  apiUrl: "https://api.mangacopy.com/api/v3",
  downloadDir: "",
  readMode: "scroll",
  autoLogin: true,
  loginUserInfo: "",
  zoomFactor: 1.0,
  windowInfo: undefined,
  proxyInfo: undefined,
};

if (!existsSync(configFilepath)) {
  writeFileSync(configFilepath, JSON.stringify(initConfig, undefined, 2));
}

const getConfig = trpc.procedure.query(async () => {
  const configStr = await readFile(configFilepath, { encoding: "utf-8" });
  return JSON.parse(configStr) as Config;
});

const saveConfig = trpc.procedure
  .input(
    z.object({
      theme: z.enum(["light", "dark"]).optional(),
      apiUrl: z.string().optional(),
      downloadDir: z.string().optional(),
      readMode: z.enum(["scroll", "click"]).optional(),
      autoLogin: z.boolean().optional(),
      loginUserInfo: z.string().optional(),
      zoomFactor: z.number().optional(),
      windowInfo: z
        .object({
          x: z.number(),
          y: z.number(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
      proxyInfo: z
        .object({
          host: z.string(),
          port: z.number(),
          username: z.string(),
          password: z.string(),
        })
        .optional(),
    }) satisfies z.ZodType<Partial<Config>>,
  )
  .query(async ({ input }) => {
    const configStr = await readFile(configFilepath, { encoding: "utf-8" });
    const config = JSON.parse(configStr) as Config;
    Object.assign(config, input);
    await writeFile(configFilepath, JSON.stringify(config, undefined, 2));
  });

export const router = {
  getConfig,
  saveConfig,
};
