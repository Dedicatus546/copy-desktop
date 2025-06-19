import { randomUUID } from "node:crypto";

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

export const router = {
  minimizeWin: minimizeWinRpc,
  closeWin: closeWinRpc,
  openLink: openLinkRpc,
  showItemInFolder: showItemInFolderRpc,
  selectFolder: selectFolderRpc,
  getUuid: getUuidRpc,
  hasFfmpegCommand: hasFfmpegCommandRpc,
};
