import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomUUID,
} from "node:crypto";

import { createLogger } from "@electron/module/logger";
import { dialog, shell } from "electron";
import which from "which";
import { z } from "zod";

import { trpc } from "./trpc";

const { error, info } = createLogger("common.router");

const minimizeWinRpc = trpc.procedure.query(({ ctx }) => {
  const win = ctx.win;
  win.minimize();
});

const closeWinRpc = trpc.procedure.query(({ ctx }) => {
  const win = ctx.win;
  win.close();
});

const openLinkRpc = trpc.procedure
  .input(
    z.object({
      url: z.string(),
    }),
  )
  .query(({ input }) => {
    shell.openExternal(input.url);
  });

const showItemInFolderRpc = trpc.procedure
  .input(
    z.object({
      path: z.string(),
    }),
  )
  .query(({ input }) => {
    shell.showItemInFolder(input.path);
  });

const selectFolderRpc = trpc.procedure.query(async ({ ctx }) => {
  const { win } = ctx;
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  return result.filePaths[0];
});

const getUuidRpc = trpc.procedure.query(() => {
  const uuid = randomUUID();
  return uuid;
});

const hasFfmpegCommandRpc = trpc.procedure.query(async () => {
  try {
    const path = await which("ffmpeg");
    info("检测到 ffmpeg 命令", path);
    return true;
  } catch (e) {
    error("未检测到 ffmpeg 命令", e);
  }
});

// 32 位
const key = Buffer.from(
  createHash("sha256").update("copy-desktop-key").digest("hex").slice(0, 32),
  "utf-8",
);

// 16位
const iv = Buffer.from(
  createHash("sha256").update("copy-desktop-iv").digest("hex").slice(0, 16),
  "utf-8",
);

const encryptLoginUserRpc = trpc.procedure
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const { username, password } = input;
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    let result = cipher.update(
      JSON.stringify({
        username,
        password,
      }),
      "utf-8",
      "base64",
    );
    result += cipher.final("base64");

    return result;
  });

export const decryptLoginUserRpc = trpc.procedure
  .input(z.string())
  .query(async ({ input }) => {
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    let result = decipher.update(input, "base64", "utf-8");
    result += decipher.final("utf-8");
    return JSON.parse(result) as { username: string; password: string };
  });

export const router = {
  minimizeWin: minimizeWinRpc,
  closeWin: closeWinRpc,
  openLink: openLinkRpc,
  showItemInFolder: showItemInFolderRpc,
  selectFolder: selectFolderRpc,
  getUuid: getUuidRpc,
  hasFfmpegCommand: hasFfmpegCommandRpc,
  decryptLoginUser: decryptLoginUserRpc,
  encryptLoginUser: encryptLoginUserRpc,
};
