import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { dataDir } from "@electron/shared/path";

export interface DownloadBaseItem {
  type: DownloadItemType;
}

export interface DownloadComicItem extends DownloadBaseItem {
  name: DownloadItemType.COMIC;
  picList: Array<string>;
}

export interface DownloadLightNovelItem extends DownloadBaseItem {
  name: DownloadItemType.LIGTH_NOVEL;
  txt: string;
  picList: Array<string>;
}

export type DownloadItem = DownloadComicItem | DownloadLightNovelItem;

export enum DownloadItemType {
  COMIC,
  LIGTH_NOVEL,
}

export const downloadDir = resolve(dataDir, "download");

export const animeDownloadDir = resolve(downloadDir, "anime");
export const comicDownloadDir = resolve(downloadDir, "comic");
export const lightNovelDownloadDir = resolve(downloadDir, "light-novel");

export const downloadDownloadingFilepath = resolve(
  downloadDir,
  "downloading.json",
);
export const downloadCompletegFilepath = resolve(downloadDir, "complete.json");

[animeDownloadDir, comicDownloadDir, lightNovelDownloadDir].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, {
      recursive: true,
    });
  }
});

[downloadDownloadingFilepath, downloadCompletegFilepath].forEach((path) => {
  if (!existsSync(path)) {
    writeFileSync(path, "[]");
  }
});

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

export const getDownloadCompleteList = () => {
  // TODO
};

export const saveDownloadCompleteList = () => {
  // TODO
};
