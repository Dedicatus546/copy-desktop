import { dialog, shell } from "electron";
import { z } from "zod";

import { trpc } from "./trpc";

const minimizeWin = trpc.procedure.query(({ ctx }) => {
  const win = ctx.win;
  win.minimize();
});

const closeWin = trpc.procedure.query(({ ctx }) => {
  const win = ctx.win;
  win.close();
});

const openLink = trpc.procedure
  .input(
    z.object({
      url: z.string(),
    }),
  )
  .query(({ input }) => {
    shell.openExternal(input.url);
  });

const showItemInFolder = trpc.procedure
  .input(
    z.object({
      path: z.string(),
    }),
  )
  .query(({ input }) => {
    shell.showItemInFolder(input.path);
  });

const selectFolder = trpc.procedure.query(async ({ ctx }) => {
  const { win } = ctx;
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  return result.filePaths[0];
});

export const router = {
  minimizeWin,
  closeWin,
  openLink,
  showItemInFolder,
  selectFolder,
};
