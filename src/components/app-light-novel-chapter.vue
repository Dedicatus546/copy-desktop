<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import {
  getLightNovelVolumeApi,
  getLightNovelVolumeListApi,
  LightNovelChapter,
} from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
import useDialog from "@/compositions/use-dialog";
import useSnackbar from "@/compositions/use-snack-bar";
import { createLogger } from "@/logger";
import { useDownloadStore } from "@/stores/use-download-store";

const { info } = createLogger("light-novel");

const { lightNovelPathWord, lightNovelName } = defineProps<{
  lightNovelPathWord: string;
  lightNovelName: string;
}>();

const lastReadChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
}>("lastReadChapter");

const dialog = useDialog();
const snackbar = useSnackbar();
const downloadStore = useDownloadStore();

const updateLastReadChapter = (chapter: { uuid: string; name: string }) => {
  lastReadChapterModel.value = {
    chapterUuid: chapter.uuid,
    chapterName: chapter.name,
  };
};

const { loading, data } = usePagination(
  () =>
    getLightNovelVolumeListApi({
      lightNovelPathWord,
    }),
  {
    initialPage: 1,
    initialPageSize: 100,
    data: (res) => res.results.list,
    total: (res) => res.results.total,
  },
);

const { data: volumeData, send } = useRequest(
  (chapterId: string) =>
    getLightNovelVolumeApi({
      lightNovelPathWord,
      chapterId,
    }),
  {
    immediate: false,
  },
);

const downloadLightNovel = async (chapter: LightNovelChapter) => {
  const key = lightNovelPathWord + "-" + chapter.id;
  if (downloadStore.animeDownloadingMap[key]) {
    snackbar.warning("任务正在下载中，请勿重复点击");
    return;
  }
  if (downloadStore.lightNovelCompleteMap[key]) {
    dialog({
      width: 300,
      title: "确认",
      content: "该章节已下载，是否重新下载？",
      async onOk() {
        await send(chapter.id);
        downloadStore.addDownloadTaskAction({
          uuid: await trpcClient.getUuid.query(),
          type: "light-novel",
          lightNovelName,
          lightNovelPathWord,
          chapterName: chapter.name,
          chapterId: chapter.id,
          txtUrl: volumeData.value.results.volume.txt_addr,
          txtEncoding: volumeData.value.results.volume.txt_encoding,
          picUrlList: volumeData.value.results.volume.contents
            .filter((item) => item.content_type === 2 && item.content !== null)
            .map((item) => item.content!),
          filepath: "",
        });
        snackbar.success("添加下载任务成功");
        info("添加 %s 下载任务", lightNovelName);
      },
    });
    return;
  }
  await send(chapter.id);
  downloadStore.addDownloadTaskAction({
    uuid: await trpcClient.getUuid.query(),
    type: "light-novel",
    lightNovelName,
    lightNovelPathWord,
    chapterName: chapter.name,
    chapterId: chapter.id,
    txtUrl: volumeData.value.results.volume.txt_addr,
    txtEncoding: volumeData.value.results.volume.txt_encoding,
    picUrlList: volumeData.value.results.volume.contents
      .filter((item) => item.content_type === 2 && item.content !== null)
      .map((item) => item.content!),
    filepath: "",
  });
  snackbar.success("添加下载任务成功");
  info("添加 %s 下载任务", lightNovelName);
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
        <v-col v-for="item of items" :key="item.raw.id" :cols="12" :lg="6">
          <v-row no-gutters class="wind-gap-2 wind-items-center">
            <v-col class="wind-min-w-0">
              <app-scroll-wrapper>{{ item.raw.name }}</app-scroll-wrapper>
            </v-col>
            <v-col cols="auto">
              <router-link
                :to="{
                  name: 'LIGHT_NOVEL_READ',
                  params: {
                    lightNovelPathWord: item.raw.book_path_word,
                    chapterId: item.raw.id,
                  },
                }"
                custom
              >
                <template #default="{ navigate }">
                  <v-btn
                    variant="flat"
                    :color="
                      lastReadChapterModel?.chapterUuid === item.raw.id
                        ? 'primary'
                        : undefined
                    "
                    class="chapter-btn"
                    @click="
                      () => (
                        updateLastReadChapter({
                          name: item.raw.name,
                          uuid: item.raw.id,
                        }),
                        navigate()
                      )
                    "
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
                  downloadStore.lightNovelDownloadingMap[
                    lightNovelPathWord + '-' + item.raw.id
                  ]
                    ? 'info'
                    : downloadStore.lightNovelCompleteMap[
                          lightNovelPathWord + '-' + item.raw.id
                        ]
                      ? 'success'
                      : undefined
                "
                variant="flat"
                class="chapter-btn wind-ml-2"
                @click="downloadLightNovel(item.raw)"
              >
                <template #prepend>
                  <v-icon icon="mdi-download"></v-icon>
                </template>
                {{
                  downloadStore.lightNovelDownloadingMap[
                    lightNovelPathWord + "-" + item.raw.id
                  ]
                    ? "正在下载 " +
                      ((
                        downloadStore.lightNovelDownloadingMap[
                          lightNovelPathWord + "-" + item.raw.id
                        ]!.percent * 100
                      ).toFixed(2) +
                        "%")
                    : downloadStore.lightNovelCompleteMap[
                          lightNovelPathWord + "-" + item.raw.id
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
