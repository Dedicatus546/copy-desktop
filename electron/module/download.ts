import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { dataDir } from "@electron/shared/path";
import { exists } from "@electron/shared/utils";

export interface DownloadBaseItem {
  uuid: string;
  filepath: string;
}

export interface DownloadComicItem extends DownloadBaseItem {
  type: "comic";
  comicPathWord: string;
  comicName: string;
  groupPathWord: string;
  groupName: string;
  chapterName: string;
  chapterId: string;
  picUrlList: Array<string>;
}

export interface DownloadLightNovelItem extends DownloadBaseItem {
  type: "light-novel";
  lightNovelPathWord: string;
  lightNovelName: string;
  chapterName: string;
  chapterId: string;
  txtUrl: string;
  txtEncoding: string;
  picUrlList: Array<string>;
}

export interface DownloadAnimeItem extends DownloadBaseItem {
  type: "anime";
  animePathWord: string;
  animeName: string;
  chapterName: string;
  chapterId: string;
  videoM3u8Url: string;
}

export type DownloadItem =
  | DownloadComicItem
  | DownloadLightNovelItem
  | DownloadAnimeItem;

export const downloadDir = resolve(dataDir, "download");

export const animeDownloadDir = resolve(downloadDir, "anime");
export const comicDownloadDir = resolve(downloadDir, "comic");
export const lightNovelDownloadDir = resolve(downloadDir, "light-novel");

export const downloadDownloadingFilepath = resolve(
  downloadDir,
  "downloading.json",
);
export const downloadCompleteFilepath = resolve(downloadDir, "complete.json");

await Promise.all(
  [animeDownloadDir, comicDownloadDir, lightNovelDownloadDir].map(
    async (dir) => {
      if (!(await exists(dir))) {
        await mkdir(dir, {
          recursive: true,
        });
      }
    },
  ),
);

await Promise.all(
  [downloadDownloadingFilepath, downloadCompleteFilepath].map(async (path) => {
    if (!(await exists(path))) {
      await writeFile(path, "[]");
    }
  }),
);

export const getDownloadDownloadingList = async () => {
  const content = await readFile(downloadDownloadingFilepath, {
    encoding: "utf-8",
  });
  return JSON.parse(content) as Array<DownloadItem>;
};

export const saveDownloadDownloadingList = async (
  list: Array<DownloadItem>,
) => {
  await writeFile(
    downloadDownloadingFilepath,
    JSON.stringify(list, undefined, 2),
    {
      encoding: "utf-8",
    },
  );
};

export const getDownloadCompleteList = async () => {
  const content = await readFile(downloadCompleteFilepath, {
    encoding: "utf-8",
  });
  return JSON.parse(content) as Array<DownloadItem>;
};

export const saveDownloadCompleteList = async (list: Array<DownloadItem>) => {
  await writeFile(
    downloadCompleteFilepath,
    JSON.stringify(list, undefined, 2),
    {
      encoding: "utf-8",
    },
  );
};
