import {
  DownloadComicItem,
  DownloadItem,
  DownloadLightNovelItem,
} from "@electron/module/download";
import { omit } from "radash";

import { trpcClient } from "@/apis/ipc";
import { emitter } from "@/mitt";

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

  const initAction = () => {
    trpcClient.getDownloadDownloadingList.query().then((list) => {
      state.downloadingList = list.map((item) => {
        return {
          ...item,
          status: "downloading",
          percent: 0.3,
        };
      });
    });
    trpcClient.getDownloadCompleteList.query().then((list) => {
      state.completeList = list;
    });
  };

  const addDownloadTaskAction = async (item: DownloadItem) => {
    state.downloadingList.push({
      ...item,
      status: "pending",
      percent: 0,
    });
    const first = state.downloadingList[0];
    if (first.status === "pending") {
      if (first.type === "comic") {
        await downloadComicAction(first);
      } else if (first.type === "light-novel") {
        await downloadLightNovelAction(first);
      }
    }
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
              state.completeList.push(
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

  // TODO
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
              state.completeList.push(
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

  const syncAction = async () => {
    await trpcClient.saveDownloadDownloadingList.query(
      state.downloadingList.map((item) => omit(item, ["status", "percent"])),
    );
    await trpcClient.saveDownloadCompleteList.query(state.completeList);
  };

  initAction();

  return {
    ...toRefs(state),
    addDownloadTaskAction,
    downloadComicAction,
    downloadLightNovelAction,
  };
});
