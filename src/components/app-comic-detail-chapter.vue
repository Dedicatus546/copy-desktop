<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import {
  ComicChapter,
  getComicChapterListApi,
  getComicPicListApi,
} from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";

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

const contextMenuState = reactive({
  show: false,
  target: null as Element | null,
  targetData: null as ComicChapter | null,
});

const showContextMenu = (e: Event, item: ComicChapter) => {
  const target = e.currentTarget as HTMLButtonElement;
  if (contextMenuState.target === target) {
    contextMenuState.show = !contextMenuState.show;
  } else {
    contextMenuState.target = target;
    contextMenuState.show = true;
    contextMenuState.targetData = item;
  }
};

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

const downloadSnackbarState = reactive({
  show: false,
  isDownloadComplete: false,
  downloadPercent: 0,
  filepath: "",
});
const downloadComic = async () => {
  await send(contextMenuState.targetData!.uuid);
  trpcClient.onDownloadComic.subscribe(
    {
      comicPathWord,
      groupPathWord,
      comicName,
      groupName,
      chapterName: contextMenuState.targetData!.name,
      chapterId: contextMenuState.targetData!.uuid,
      imageUrlList: picListData.value.results.chapter.contents.map(
        (item) => item.url,
      ),
    },
    {
      onStarted() {
        downloadSnackbarState.show = true;
        downloadSnackbarState.isDownloadComplete = false;
        downloadSnackbarState.downloadPercent = 0;
      },
      onData(value) {
        console.log(value);
        if (value.type === "downloading") {
          downloadSnackbarState.downloadPercent =
            (value.data.complete! / value.data.total!) * 100;
        } else if (value.type === "complete") {
          downloadSnackbarState.isDownloadComplete = true;
          downloadSnackbarState.filepath = value.data.filepath!;
          setTimeout(() => {
            downloadSnackbarState.show = false;
          }, 2000);
        }
      },
    },
  );
};

const openFile = () => {
  trpcClient.showItemInFolder.query({
    path: downloadSnackbarState.filepath,
  });
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
      <app-empty-state
        title="出现这个就大概率是出 BUG 了，请提 issue"
        :image="EMPTY_STATE_IMG"
      ></app-empty-state>
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
        <v-col
          v-for="item of items"
          :key="item.raw.uuid"
          :cols="6"
          :sm="4"
          :md="3"
          :lg="2"
        >
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
                size="large"
                class="chapter-btn"
                :color="
                  lastChapterModel?.chapterUuid === item.raw.uuid
                    ? 'primary'
                    : undefined
                "
                block
                @click="() => (updateLastReadChapter(item.raw), navigate())"
                @contextmenu="(e: Event) => showContextMenu(e, item.raw)"
              >
                <app-scroll-wrapper>
                  {{ item.raw.name }}
                </app-scroll-wrapper>
              </v-btn>
            </template>
          </router-link>
        </v-col>
      </v-row>
      <v-menu
        v-model:model-value="contextMenuState.show"
        :target="contextMenuState.target!"
        absolute
        close-on-content-click
      >
        <v-list dense>
          <v-list-item @click="downloadComic">
            <template #prepend>
              <v-icon small icon="mdi-download"></v-icon>
            </template>
            <template #title>下载</template>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-snackbar
        color="primary"
        location="top end"
        v-model:model-value="downloadSnackbarState.show"
        :timeout="-1"
        max-width="30%"
      >
        <div class="wind-mb-2">
          {{
            downloadSnackbarState.isDownloadComplete ? "下载完成" : "正在下载"
          }}
        </div>
        <div class="wind-flex wind-flex-col wind-gap-2">
          <v-progress-linear
            class="wind-self-center"
            v-bind:model-value="downloadSnackbarState.downloadPercent"
            size="large"
          />
          <div class="wind-leading-6 wind-vertical-mid">
            {{ comicName }} - {{ groupName }} -
            {{ contextMenuState.targetData?.name }}
          </div>
          <div
            class="wind-flex wind-justify-end"
            v-if="downloadSnackbarState.isDownloadComplete"
          >
            <v-btn variant="text" @click="openFile">打开文件</v-btn>
          </div>
        </div>
      </v-snackbar>
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
