<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import { getAnimeChapterDetailApi, getAnimeChapterListApi } from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
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
  info("添加 %s 下载任务", animeName);
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
        <template v-for="(item, index) of items" :key="item.raw.uuid">
          <v-divider v-if="index > 0"></v-divider>
          <v-list-item>
            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
            <template v-slot:append>
              <template v-if="userStore.isLogin">
                <router-link
                  v-for="line of item.raw.lines"
                  :key="line.path_word"
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
                      <app-scroll-wrapper>
                        {{ line.name }}
                      </app-scroll-wrapper>
                    </v-btn>
                    <v-btn
                      class="wind-ml-2"
                      @click="
                        downloadAnime(
                          item.raw.uuid,
                          item.raw.name,
                          line.path_word,
                        )
                      "
                    >
                      下载
                    </v-btn>
                  </template>
                </router-link>
              </template>
              <template v-else>
                <v-btn disabled>登陆后才可观看</v-btn>
              </template>
            </template>
          </v-list-item>
        </template>
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
