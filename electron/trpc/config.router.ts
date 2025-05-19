import { Config, getConfig, saveConfig } from "@electron/module/config";
import { z } from "zod";

import { trpc } from "./trpc";

const getConfigRpc = trpc.procedure.query(async () => {
  return getConfig();
});

const saveConfigRpc = trpc.procedure
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
    await saveConfig(input);
  });

export const router = {
  getConfig: getConfigRpc,
  saveConfig: saveConfigRpc,
};
