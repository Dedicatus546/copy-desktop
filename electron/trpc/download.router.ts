import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

import { getConfig } from "@electron/module/config";
import {
  animeDownloadDir,
  comicDownloadDir,
  getDownloadCompleteList,
  getDownloadDownloadingList,
  lightNovelDownloadDir,
  saveDownloadCompleteList,
  saveDownloadDownloadingList,
} from "@electron/module/download";
import { createLogger } from "@electron/module/logger";
import { exists, resolveProxyUrl } from "@electron/shared/utils";
import archiver from "archiver";
import { net } from "electron";
import pLimit from "p-limit";
import { z } from "zod";

import { trpc } from "./trpc";

const limit = pLimit(3);

const { info } = createLogger("download.router");

const onDownloadComicRpc = trpc.procedure
  .input(
    z.object({
      comicName: z.string(),
      comicPathWord: z.string(),
      groupName: z.string(),
      groupPathWord: z.string(),
      chapterId: z.string(),
      chapterName: z.string(),
      picUrlList: z.array(z.string()),
    }),
  )
  .subscription(async function* (opts) {
    const query = opts.input;
    const filename = query.chapterName + ".zip";
    const fileDir = resolve(comicDownloadDir, query.comicName, query.groupName);
    const filepath = resolve(fileDir, filename);
    let complete = 0;
    const total = query.picUrlList.length;
    const list = query.picUrlList.map((url) =>
      limit(() =>
        net
          .fetch(url, {
            method: "GET",
          })
          .then((res) => res.arrayBuffer()),
      ),
    );
    for (const p of list) {
      await p;
      complete++;
      yield {
        type: "downloading",
        data: {
          complete,
          total,
        },
      };
    }
    const arrayBufferList = await Promise.all(list);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    arrayBufferList.forEach((arrayBuffer, index) => {
      archive.append(Buffer.from(arrayBuffer), {
        name: `${index + 1}.webp`,
      });
    });
    if (!(await exists(fileDir))) {
      await mkdir(fileDir, {
        recursive: true,
      });
    }
    const output = createWriteStream(filepath);
    archive.pipe(output);
    await archive.finalize();
    yield {
      type: "complete",
      data: {
        filepath,
      },
    };
  });

const onDownloadLightNovelRpc = trpc.procedure
  .input(
    z.object({
      lightNovelName: z.string(),
      lightNovelPathWord: z.string(),
      chapterId: z.string(),
      chapterName: z.string(),
      txtUrl: z.string(),
      txtEncoding: z.string(),
      picUrlList: z.array(z.string()),
    }),
  )
  .subscription(async function* (opts) {
    const query = opts.input;
    const filename = query.chapterName + ".zip";
    const fileDir = resolve(lightNovelDownloadDir, query.lightNovelName);
    const filepath = resolve(fileDir, filename);

    let complete = 0;
    const list = [
      limit(() =>
        net
          .fetch(query.txtUrl, {
            method: "GET",
          })
          .then((res) => res.arrayBuffer())
          .then((buffer) => ({
            type: "txt",
            buffer,
          })),
      ),
    ];
    const total = query.picUrlList.length + 1;
    query.picUrlList.forEach((url) =>
      list.push(
        limit(() =>
          net
            .fetch(url, {
              method: "GET",
            })
            .then((res) => res.arrayBuffer())
            .then((buffer) => ({
              type: "image",
              buffer,
            })),
        ),
      ),
    );
    for (const p of list) {
      await p;
      complete++;
      yield {
        type: "downloading",
        data: {
          complete,
          total,
        },
      };
    }
    const arrayBufferObjectList = await Promise.all(list);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    arrayBufferObjectList.forEach((arrayBufferObject, index) => {
      if (arrayBufferObject.type === "txt") {
        archive.append(Buffer.from(arrayBufferObject.buffer), {
          name: `${index + 1}.txt`,
        });
      } else {
        archive.append(Buffer.from(arrayBufferObject.buffer), {
          name: `${index + 1}.webp`,
        });
      }
    });
    if (!(await exists(fileDir))) {
      await mkdir(fileDir, {
        recursive: true,
      });
    }
    const output = createWriteStream(filepath);
    archive.pipe(output);
    await archive.finalize();
    yield {
      type: "complete",
      data: {
        filepath,
      },
    };
  });

const onDownloadAnimeRpc = trpc.procedure
  .input(
    z.object({
      animelName: z.string(),
      animelPathWord: z.string(),
      chapterId: z.string(),
      chapterName: z.string(),
      videoM3u8Url: z.string(),
    }),
  )
  .subscription(async function* (opts) {
    const query = opts.input;
    const filename = query.chapterName + ".mp4";
    const fileDir = resolve(animeDownloadDir, query.animelName);
    const filepath = resolve(fileDir, filename);
    const config = await getConfig();
    const proxyUrl = resolveProxyUrl(config.proxyInfo);

    info("开始解析视频长度");
    const ffprobeSpawn = spawn(
      "ffprobe",
      [
        proxyUrl ? ["-http_proxy", proxyUrl] : [],
        ["-v", "error"],
        ["-show_entries", "format=duration"],
        ["-of", "default=noprint_wrappers=1:nokey=1"],
        query.videoM3u8Url,
      ].flat(),
    );
    const stdout = await ffprobeSpawn.stdout
      .setEncoding("utf-8")
      .reduce((str, item) => str + item, "");
    const duration = Number.parseFloat(stdout);
    info("视频长度为", duration);

    if (!(await exists(fileDir))) {
      await mkdir(fileDir, {
        recursive: true,
      });
    }

    info("开始通过 ffmpeg 下载合并 m3u8 文件");
    const ffmpegSpawn = spawn(
      "ffmpeg",
      [
        proxyUrl ? ["-http_proxy", proxyUrl] : [],
        ["-i", query.videoM3u8Url],
        ["-c", "copy"],
        ["-f", "mp4"],
        filepath,
      ].flat(),
    );

    const iterator =
      ffmpegSpawn.stderr.iterator() as NodeJS.AsyncIterator<Buffer>;

    for await (const buffer of iterator) {
      const content = buffer.toString("utf-8");
      info("从 ffmpeg 接收输出信息", content);
      const timeMatch = content.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      if (timeMatch) {
        const [, h, m, s] = timeMatch;
        yield {
          type: "downloading",
          data: {
            total: duration,
            complete: +h * 60 * 60 + +m * 60 + +s,
          },
        };
      }
    }

    info("ffmpeg 处理结束");

    yield {
      type: "complete",
      data: {
        filepath,
      },
    };
  });

const getDownloadDownloadingListRpc = trpc.procedure.query(() => {
  return getDownloadDownloadingList();
});

const getDownloadCompleteListRpc = trpc.procedure.query(() => {
  return getDownloadCompleteList();
});

const saveDownloadDownloadingListRpc = trpc.procedure
  .input(z.array(z.any()))
  .query(({ input }) => {
    return saveDownloadDownloadingList(input);
  });

const saveDownloadCompleteListRpc = trpc.procedure
  .input(z.array(z.any()))
  .query(({ input }) => {
    return saveDownloadCompleteList(input);
  });

export const router = {
  onDownloadComic: onDownloadComicRpc,
  onDownloadLightNovel: onDownloadLightNovelRpc,
  getDownloadDownloadingList: getDownloadDownloadingListRpc,
  getDownloadCompleteList: getDownloadCompleteListRpc,
  saveDownloadDownloadingList: saveDownloadDownloadingListRpc,
  saveDownloadCompleteList: saveDownloadCompleteListRpc,
  onDownloadAnime: onDownloadAnimeRpc,
};
