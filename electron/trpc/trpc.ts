// src/shared/trpc.ts
import { initTRPC } from "@trpc/server";
import { type BrowserWindow } from "electron";

interface Context {
  win: BrowserWindow;
  // 可以添加更多依赖...
}

// 初始化 tRPC
export const trpc = initTRPC.context<Context>().create();
