import { router as commonRouter } from "./common.router";
import { router as configRouter } from "./config.router";
import { trpc } from "./trpc";

export const router = trpc.router({
  ...commonRouter,
  ...configRouter,
});

// 导出 Router 类型
export type Router = typeof router;
