<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import { getAnimeChapterDetailApi, getAnimeChapterListApi } from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
import useDialog from "@/compositions/use-dialog";
import useSnackbar from "@/compositions/use-snack-bar";
import { createLogger } from "@/logger";
import { useDownloadStore } from "@/stores/use-download-store";
import useUserStore from "@/stores/use-user-store";

const { info } = createLogger("anime");

const { animePathWord, animeName } = defineProps<{
  animePathWord: string;
  animeName: string;
}>();

const lastReadChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
  linePathWord: string;
}>("lastReadChapter");

const snackbar = useSnackbar();
const dialog = useDialog();
const downloadStore = useDownloadStore();
const userStore = useUserStore();

const updateLastReadChapter = (chapter: {
  uuid: string;
  name: string;
  linePathWord: string;
}) => {
  lastReadChapterModel.value = {
    chapterUuid: chapter.uuid,
    chapterName: chapter.name,
    linePathWord: chapter.linePathWord,
  };
};

const { loading, data } = usePagination(
  () =>
    getAnimeChapterListApi({
      animePathWord,
    }),
  {
    initialPage: 1,
    initialPageSize: 100,
    data: (res) => res.results.list,
    total: (res) => res.results.total,
  },
);

const { data: chapterData, send } = useRequest(
  (animeChapterUuid: string, linePathWord: string) =>
    getAnimeChapterDetailApi({
      animeChapterUuid,
      animePathWord,
      linePathWord,
    }),
  {
    immediate: false,
  },
);

const downloadAnime = async (
  animeChapterUuid: string,
  animeChapterName: string,
  linePathWord: string,
) => {
  if (!(await trpcClient.hasFfmpegCommand.query())) {
    snackbar.warning("未检测到 ffmpeg 命令，请将其添加到 PATH 中");
    return;
  }
  const key = animePathWord + "-" + animeChapterUuid;
  if (downloadStore.animeDownloadingMap[key]) {
    snackbar.warning("任务正在下载中，请勿重复点击");
    return;
  }
  if (downloadStore.animeCompleteMap[key]) {
    dialog({
      width: 300,
      title: "确认",
      content: "该集已下载，是否重新下载？",
      async onOk() {
        await send(animeChapterUuid, linePathWord);
        downloadStore.addDownloadTaskAction({
          uuid: await trpcClient.getUuid.query(),
          type: "anime",
          animeName,
          animePathWord,
          chapterName: animeChapterName,
          chapterId: animeChapterUuid,
          videoM3u8Url: chapterData.value.results.chapter.video,
          filepath: "",
        });
        snackbar.success("添加下载任务成功");
        info("添加 %s %s 下载任务", animeName, animeChapterName);
      },
    });
    return;
  }
  await send(animeChapterUuid, linePathWord);
  downloadStore.addDownloadTaskAction({
    uuid: await trpcClient.getUuid.query(),
    type: "anime",
    animeName,
    animePathWord,
    chapterName: animeChapterName,
    chapterId: animeChapterUuid,
    videoM3u8Url: chapterData.value.results.chapter.video,
    filepath: "",
  });
  snackbar.success("添加下载任务成功");
  info("添加 %s %s 下载任务", animeName, animeChapterName);
};
</script>

<template>
  <v-data-iterator
    :items="data"
    :items-per-page="data.length"
    :loading="loading"
  >
    <template #loader>
      <div
        class="wind-flex wind-h-[30vh] wind-items-center wind-justify-center"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </template>
    <template #no-data>
      <v-empty-state
        title="出现这个就大概率是出 BUG 了，请提 issue"
        :image="EMPTY_STATE_IMG"
      ></v-empty-state>
    </template>
    <template #default="{ items }">
      <v-list>
        <v-list-item v-for="item of items" :key="item.raw.uuid">
          <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
          <template v-slot:append>
            <template v-if="userStore.isLogin">
              <template v-for="line of item.raw.lines" :key="line.path_word">
                <router-link
                  :to="{
                    name: 'ANIME_WATCH',
                    params: {
                      animePathWord,
                      animeChapterUuid: item.raw.uuid,
                      linePathWord: line.path_word,
                    },
                  }"
                  custom
                >
                  <template #default="{ navigate }">
                    <v-btn
                      variant="flat"
                      color="primary"
                      class="chapter-btn"
                      @click="
                        (updateLastReadChapter({
                          uuid: item.raw.uuid,
                          name: item.raw.name,
                          linePathWord: line.path_word,
                        }),
                        navigate())
                      "
                    >
                      <template #prepend>
                        <v-icon icon="mdi-play"></v-icon>
                      </template>
                      <app-scroll-wrapper>
                        {{ line.name }}
                      </app-scroll-wrapper>
                    </v-btn>
                  </template>
                </router-link>
                <v-btn
                  variant="flat"
                  :color="
                    downloadStore.animeDownloadingMap[
                      animePathWord + '-' + item.raw.uuid
                    ]
                      ? 'info'
                      : downloadStore.animeCompleteMap[
                            animePathWord + '-' + item.raw.uuid
                          ]
                        ? 'success'
                        : undefined
                  "
                  class="wind-ml-2"
                  @click="
                    downloadAnime(item.raw.uuid, item.raw.name, line.path_word)
                  "
                >
                  <template #prepend>
                    <v-icon icon="mdi-download"></v-icon>
                  </template>
                  {{
                    downloadStore.animeDownloadingMap[
                      animePathWord + "-" + item.raw.uuid
                    ]
                      ? "正在下载 " +
                        ((
                          downloadStore.animeDownloadingMap[
                            animePathWord + "-" + item.raw.uuid
                          ]!.percent * 100
                        ).toFixed(2) +
                          "%")
                      : downloadStore.animeCompleteMap[
                            animePathWord + "-" + item.raw.uuid
                          ]
                        ? "已下载"
                        : "下载"
                  }}
                </v-btn>
              </template>
            </template>
            <template v-else>
              <v-btn variant="flat" disabled>登陆后才可观看和下载</v-btn>
            </template>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-data-iterator>
</template>

<style scoped lang="scss">
.chapter-btn {
  ::v-deep(.v-btn__content) {
    min-width: 0;
  }
}
</style>
