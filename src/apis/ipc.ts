import { Router } from "@electron/trpc/router";
import { createTRPCClient } from "@trpc/client";
import { ipcLink } from "trpc-electron/renderer";

export const trpcClient = createTRPCClient({
  links: [ipcLink<Router>()],
});
