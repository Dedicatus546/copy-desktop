<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import {
  ComicChapter,
  getComicChapterListApi,
  getComicPicListApi,
} from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
import useDialog from "@/compositions/use-dialog";
import useSnackbar from "@/compositions/use-snack-bar";
import { createLogger } from "@/logger";
import { useDownloadStore } from "@/stores/use-download-store";

const { info } = createLogger("comic");

const { comicPathWord, groupPathWord, comicName, groupName } = defineProps<{
  comicPathWord: string;
  groupPathWord: string;
  comicName: string;
  groupName: string;
}>();

const lastChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
}>("lastReadChapter");

const dialog = useDialog();
const snackbar = useSnackbar();
const downloadStore = useDownloadStore();

const updateLastReadChapter = (chapter: ComicChapter) => {
  lastChapterModel.value = {
    chapterUuid: chapter.uuid,
    chapterName: chapter.name,
  };
};

const { loading, data, page, pageSize, total } = usePagination(
  (page, pageSize) =>
    getComicChapterListApi({
      comicPathWord,
      groupPathWord,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    initialPage: 1,
    initialPageSize: 100,
    data: (res) => res.results.list,
    total: (res) => res.results.total,
  },
);
const pageCount = computed(() => {
  const count = Math.ceil((total.value ?? 0) / pageSize.value);
  return count;
});

const { data: picListData, send } = useRequest(
  (chapterId: string) =>
    getComicPicListApi({
      comicPathWord,
      chapterId,
    }),
  {
    immediate: false,
  },
);

const downloadComic = async (chapter: ComicChapter) => {
  const key = comicPathWord + "-" + chapter.uuid;
  if (downloadStore.comicDownloadingMap[key]) {
    snackbar.warning("任务正在下载中，请勿重复点击");
    return;
  }
  if (downloadStore.comicCompleteMap[key]) {
    dialog({
      width: 300,
      title: "确认",
      content: "该章节已下载，是否重新下载？",
      async onOk() {
        await send(chapter.uuid);
        downloadStore.addDownloadTaskAction({
          uuid: await trpcClient.getUuid.query(),
          type: "comic",
          comicPathWord,
          comicName,
          groupPathWord,
          groupName,
          chapterName: chapter.name,
          chapterId: chapter.uuid,
          picUrlList: picListData.value.results.chapter.contents.map(
            (item) => item.url,
          ),
          filepath: "",
        });
        snackbar.success("添加下载任务成功");
        info("添加 %s 下载任务", comicName);
      },
    });
    return;
  }
  await send(chapter.uuid);
  downloadStore.addDownloadTaskAction({
    uuid: await trpcClient.getUuid.query(),
    type: "comic",
    comicPathWord,
    comicName,
    groupPathWord,
    groupName,
    chapterName: chapter.name,
    chapterId: chapter.uuid,
    picUrlList: picListData.value.results.chapter.contents.map(
      (item) => item.url,
    ),
    filepath: "",
  });
  snackbar.success("添加下载任务成功");
  info("添加 %s 下载任务", comicName);
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
      <v-row class="wind-p-1">
        <v-col v-if="pageCount > 1" :cols="12">
          <v-tabs v-model:model-value="page" bg-color="transparent">
            <v-tab v-for="item of pageCount" :key="item" :value="item">
              {{ (item - 1) * pageSize + 1 }} - {{ item * pageSize }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col v-for="item of items" :key="item.raw.uuid" :cols="12" :lg="6">
          <v-row no-gutters class="wind-gap-2 wind-items-center">
            <v-col class="wind-min-w-0">
              <app-scroll-wrapper>
                {{ item.raw.name }}
              </app-scroll-wrapper>
            </v-col>
            <v-col cols="auto">
              <router-link
                :to="{
                  name: 'COMIC_READ',
                  params: {
                    comicPathWord: item.raw.comic_path_word,
                    chapterId: item.raw.uuid,
                  },
                }"
                custom
              >
                <template #default="{ navigate }">
                  <v-btn
                    class="chapter-btn"
                    variant="flat"
                    :color="
                      lastChapterModel?.chapterUuid === item.raw.uuid
                        ? 'primary'
                        : undefined
                    "
                    @click="() => (updateLastReadChapter(item.raw), navigate())"
                  >
                    <template #prepend>
                      <v-icon icon="mdi-book-open"></v-icon>
                    </template>
                    阅读
                  </v-btn>
                </template>
              </router-link>
              <v-btn
                :color="
                  downloadStore.comicDownloadingMap[
                    comicPathWord + '-' + item.raw.uuid
                  ]
                    ? 'info'
                    : downloadStore.comicCompleteMap[
                          comicPathWord + '-' + item.raw.uuid
                        ]
                      ? 'success'
                      : undefined
                "
                variant="flat"
                class="chapter-btn wind-ml-2"
                @click="downloadComic(item.raw)"
              >
                <template #prepend>
                  <v-icon icon="mdi-download"></v-icon>
                </template>
                {{
                  downloadStore.comicDownloadingMap[
                    comicPathWord + "-" + item.raw.uuid
                  ]
                    ? "正在下载 " +
                      ((
                        downloadStore.comicDownloadingMap[
                          comicPathWord + "-" + item.raw.uuid
                        ]!.percent * 100
                      ).toFixed(2) +
                        "%")
                    : downloadStore.comicCompleteMap[
                          comicPathWord + "-" + item.raw.uuid
                        ]
                      ? "已下载"
                      : "下载"
                }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
