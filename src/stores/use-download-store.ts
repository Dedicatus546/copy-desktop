import {
  DownloadAnimeItem,
  DownloadComicItem,
  DownloadItem,
  DownloadLightNovelItem,
} from "@electron/module/download";
import { omit } from "radash";

import { trpcClient } from "@/apis/ipc";
import { createLogger } from "@/logger";
import { emitter } from "@/mitt";

const { info, warn } = createLogger("download");

type WithDownloadingInfo<T> = T & {
  status: "downloading" | "pending" | "complete";
  percent: number; // 0 - 1
};

export const useDownloadStore = defineStore("download", () => {
  const state = reactive<{
    activeTabKey: "downloading" | "complete";
    loading: boolean;
    completeList: Array<DownloadItem>;
    downloadingList: Array<WithDownloadingInfo<DownloadItem>>;
  }>({
    activeTabKey: "downloading",
    loading: false,
    completeList: [],
    downloadingList: [],
  });

  const comicDownloadingMap = computed(() => {
    return state.downloadingList
      .filter((item) => item.type === "comic")
      .reduce(
        (map, item) => {
          map[item.comicPathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<
          string,
          WithDownloadingInfo<DownloadComicItem> | undefined
        >,
      );
  });

  const comicCompleteMap = computed(() => {
    return state.completeList
      .filter((item) => item.type === "comic")
      .reduce(
        (map, item) => {
          map[item.comicPathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<string, DownloadComicItem | undefined>,
      );
  });

  const lightNovelDownloadingMap = computed(() => {
    return state.downloadingList
      .filter((item) => item.type === "light-novel")
      .reduce(
        (map, item) => {
          map[item.lightNovelPathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<
          string,
          WithDownloadingInfo<DownloadLightNovelItem> | undefined
        >,
      );
  });

  const lightNovelCompleteMap = computed(() => {
    return state.completeList
      .filter((item) => item.type === "light-novel")
      .reduce(
        (map, item) => {
          map[item.lightNovelPathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<string, DownloadLightNovelItem | undefined>,
      );
  });

  const animeDownloadingMap = computed(() => {
    return state.downloadingList
      .filter((item) => item.type === "anime")
      .reduce(
        (map, item) => {
          map[item.animePathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<
          string,
          WithDownloadingInfo<DownloadAnimeItem> | undefined
        >,
      );
  });

  const animeCompleteMap = computed(() => {
    return state.completeList
      .filter((item) => item.type === "anime")
      .reduce(
        (map, item) => {
          map[item.animePathWord + "-" + item.chapterId] = item;
          return map;
        },
        {} as Record<string, DownloadAnimeItem | undefined>,
      );
  });

  const initAction = async () => {
    await Promise.allSettled([
      trpcClient.getDownloadDownloadingList.query().then((list) => {
        state.downloadingList = list.map((item) => {
          return {
            ...item,
            status: "pending",
            percent: 0,
          };
        });
      }),
      trpcClient.getDownloadCompleteList.query().then((list) => {
        state.completeList = list;
      }),
    ]);
    if (state.downloadingList.length > 0) {
      info("初始化检测到存在未完成下载任务，尝试开始下载。");
      tryStartDownloadAction();
    }
  };

  const addDownloadTaskAction = (item: DownloadItem) => {
    state.downloadingList.push({
      ...item,
      status: "pending",
      percent: 0,
    });
    tryStartDownloadAction();
  };

  const tryStartDownloadAction = async () => {
    const first = state.downloadingList[0];
    if (!first) {
      warn("未检测到可下载的任务");
      return;
    }
    if (first.status === "pending") {
      if (first.type === "comic") {
        await downloadComicAction(first);
      } else if (first.type === "light-novel") {
        await downloadLightNovelAction(first);
      } else if (first.type === "anime") {
        await downloadAnimeAction(first);
      }
    }
    // 尝试下载下一项
    tryStartDownloadAction();
  };

  const downloadComicAction = async (
    downloadItem: WithDownloadingInfo<DownloadComicItem>,
  ) => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    trpcClient.onDownloadComic.subscribe(
      {
        comicPathWord: downloadItem.comicPathWord,
        comicName: downloadItem.comicName,
        groupPathWord: downloadItem.groupPathWord,
        groupName: downloadItem.groupName,
        chapterId: downloadItem.chapterId,
        chapterName: downloadItem.chapterName,
        picUrlList: downloadItem.picUrlList,
      },
      {
        onStarted() {
          downloadItem.status = "downloading";
        },
        onData(value) {
          if (value.type === "downloading") {
            downloadItem.percent = value.data.complete! / value.data.total!;
          } else if (value.type === "complete") {
            downloadItem.status = "complete";
            downloadItem.filepath = value.data.filepath!;
            const index = state.downloadingList.findIndex(
              (item) => item.uuid === downloadItem.uuid,
            );
            if (index > -1) {
              const [item] = state.downloadingList.splice(index, 1);
              state.completeList.unshift(
                omit(item as WithDownloadingInfo<DownloadComicItem>, [
                  "status",
                  "percent",
                ]),
              );
              resolve();
            } else {
              reject(
                new Error(
                  "下载列表内找不到对应项，uuid 为 " + downloadItem.uuid,
                ),
              );
            }
          }
        },
        onError(err) {
          reject(err);
        },
      },
    );
    await promise;
    await syncAction();
    emitter.emit("DownloadSuccess", downloadItem);
  };

  const downloadLightNovelAction = async (
    downloadItem: WithDownloadingInfo<DownloadLightNovelItem>,
  ) => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    trpcClient.onDownloadLightNovel.subscribe(
      {
        lightNovelName: downloadItem.lightNovelName,
        lightNovelPathWord: downloadItem.lightNovelPathWord,
        chapterId: downloadItem.chapterId,
        chapterName: downloadItem.chapterName,
        txtUrl: downloadItem.txtUrl,
        txtEncoding: downloadItem.txtEncoding,
        picUrlList: downloadItem.picUrlList,
      },
      {
        onStarted() {
          downloadItem.status = "downloading";
        },
        onData(value) {
          if (value.type === "downloading") {
            downloadItem.percent = value.data.complete! / value.data.total!;
          } else if (value.type === "complete") {
            downloadItem.status = "complete";
            downloadItem.filepath = value.data.filepath!;
            const index = state.downloadingList.findIndex(
              (item) => item.uuid === downloadItem.uuid,
            );
            if (index > -1) {
              const [item] = state.downloadingList.splice(index, 1);
              state.completeList.unshift(
                omit(item as WithDownloadingInfo<DownloadLightNovelItem>, [
                  "status",
                  "percent",
                ]),
              );
              resolve();
            } else {
              reject(
                new Error(
                  "下载列表内找不到对应项，uuid 为 " + downloadItem.uuid,
                ),
              );
            }
          }
        },
        onError(err) {
          reject(err);
        },
      },
    );
    await promise;
    await syncAction();
    emitter.emit("DownloadSuccess", downloadItem);
  };

  const downloadAnimeAction = async (
    downloadItem: WithDownloadingInfo<DownloadAnimeItem>,
  ) => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    trpcClient.onDownloadAnime.subscribe(
      {
        animelName: downloadItem.animeName,
        animelPathWord: downloadItem.animePathWord,
        chapterId: downloadItem.chapterId,
        chapterName: downloadItem.chapterName,
        videoM3u8Url: downloadItem.videoM3u8Url,
      },
      {
        onStarted() {
          downloadItem.status = "downloading";
        },
        onData(value) {
          if (value.type === "downloading") {
            downloadItem.percent = value.data.complete! / value.data.total!;
          } else if (value.type === "complete") {
            downloadItem.status = "complete";
            downloadItem.filepath = value.data.filepath!;
            const index = state.downloadingList.findIndex(
              (item) => item.uuid === downloadItem.uuid,
            );
            if (index > -1) {
              const [item] = state.downloadingList.splice(index, 1);
              state.completeList.unshift(
                omit(item as WithDownloadingInfo<DownloadAnimeItem>, [
                  "status",
                  "percent",
                ]),
              );
              resolve();
            } else {
              reject(
                new Error(
                  "下载列表内找不到对应项，uuid 为 " + downloadItem.uuid,
                ),
              );
            }
          }
        },
        onError(err) {
          reject(err);
        },
      },
    );
    await promise;
    await syncAction();
    emitter.emit("DownloadSuccess", downloadItem);
  };

  const syncAction = async () => {
    await trpcClient.saveDownloadDownloadingList.query(
      state.downloadingList.map((item) => omit(item, ["status", "percent"])),
    );
    await trpcClient.saveDownloadCompleteList.query(state.completeList);
  };

  return {
    ...toRefs(state),
    comicDownloadingMap,
    comicCompleteMap,
    lightNovelDownloadingMap,
    lightNovelCompleteMap,
    animeDownloadingMap,
    animeCompleteMap,
    initAction,
    addDownloadTaskAction,
    downloadComicAction,
    downloadLightNovelAction,
    downloadAnimeAction,
  };
});
