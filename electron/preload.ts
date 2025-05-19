// import { contextBridge, ipcRenderer } from "electron";
import { exposeElectronTRPC } from "trpc-electron/main";

process.once("loaded", () => {
  exposeElectronTRPC();
});
