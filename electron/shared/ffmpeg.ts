import { existsSync } from "node:fs";
import { arch, platform } from "node:os";
import { join } from "node:path";

import { createLogger } from "@electron/module/logger";

import { ffmpegDir } from "./path";

const { error, info } = createLogger("ffmpeg");

const osArch = arch();
const osPlatform = platform();

info("系统信息", osPlatform, osArch);

export const ffmpegPath = join(
  ffmpegDir,
  `${osPlatform}-${osArch}`,
  `ffmpeg${osPlatform === "win32" ? ".exe" : ""}`,
);

info("ffmpeg 二进制文件路径", ffmpegPath);

if (!existsSync(ffmpegPath)) {
  error("未找到 ffmpeg 二进制文件");
}
