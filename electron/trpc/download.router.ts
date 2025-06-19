import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
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
import { ffmpegPath } from "@electron/shared/ffmpeg";
import { resolveProxyUrl } from "@electron/shared/utils";
import archiver from "archiver";
import { net } from "electron";
import pLimit from "p-limit";
import { z } from "zod";

import { trpc } from "./trpc";

const limit = pLimit(3);

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
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, {
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
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, {
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

    // TODO 如何将类似事件的编码形式转为可用 yield 的语法。
    // emiiter -> generator ？
    const ffmpegSpawn = spawn(
      ffmpegPath,
      [
        proxyUrl ? ["-http_proxy", proxyUrl] : [],
        ["-i", query.videoM3u8Url],
        ["-c", "copy"],
        ["-f", "mp4"],
        filepath,
      ].flat(),
    );

    let isNotEnd = true;
    let {
      promise,
      resolve: pResolve,
      reject: pReject,
    } = Promise.withResolvers<string>();

    // TODO 取第一帧可以拿到 Duration 解析 time ，然后转化为秒，取百分比
    ffmpegSpawn.stderr.on("data", (data: string) => {
      pResolve(data);
      const {
        promise: nextPromise,
        resolve: nextPResolve,
        reject: nextPReject,
      } = Promise.withResolvers<string>();
      promise = nextPromise;
      pResolve = nextPResolve;
      pReject = nextPReject;
    });

    // TODO 取第一帧可以拿到 Duration 解析 time ，然后转化为秒，取百分比
    ffmpegSpawn.stderr.on("error", (error: string) => {
      pReject(error);
    });

    ffmpegSpawn.stderr.on("end", () => {
      isNotEnd = false;
    });

    while (isNotEnd) {
      const content = await promise;
      const timeMatch = content.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      if (timeMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, h, m, s] = timeMatch;
        yield {
          type: "downloading",
          data: {
            total: 1000,
            complete: +h * 60 * 60 + +m * 60 + +s,
          },
        };
      }
    }
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
