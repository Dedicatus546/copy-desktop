import { router as commonRouter } from "./common.router";
import { router as configRouter } from "./config.router";
import { router as proxyServerRouter } from "./proxy-server.router";
import { trpc } from "./trpc";

export const router = trpc.router({
  ...commonRouter,
  ...configRouter,
  ...proxyServerRouter,
});

// 导出 Router 类型
export type Router = typeof router;
