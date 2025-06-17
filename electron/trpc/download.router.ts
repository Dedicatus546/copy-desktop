import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { comicDownloadDir } from "@electron/module/download";
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
      imageUrlList: z.array(z.string()),
    }),
  )
  .subscription(async function* (opts) {
    const query = opts.input;
    const filename = query.chapterName + ".zip";
    const fileDir = resolve(comicDownloadDir, query.comicName, query.groupName);
    const filepath = resolve(fileDir, filename);
    let complete = 0;
    const total = query.imageUrlList.length;
    const list = query.imageUrlList.map((url) =>
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

// const getDownloadListRpc = trpc.procedure
//   .input(
//     z.object({
//       page: z.number(),
//       pageSize: z.number(),
//     }),
//   )
//   .query(({ input }) => {
//     const { page, pageSize } = input;
//   });

export const router = {
  onDownloadComic: onDownloadComicRpc,
  // getDownloadList: getDownloadListRpc,
};
