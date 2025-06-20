<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import {
  getLightNovelVolumeApi,
  getLightNovelVolumeListApi,
  LightNovelChapter,
} from "@/apis";
import { trpcClient } from "@/apis/ipc";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
import { useDownloadStore } from "@/stores/use-download-store";

const { lightNovelPathWord, lightNovelName } = defineProps<{
  lightNovelPathWord: string;
  lightNovelName: string;
}>();

const lastReadChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
}>("lastReadChapter");

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

const contextMenuState = reactive({
  show: false,
  target: null as Element | null,
  targetData: null as LightNovelChapter | null,
});

const showContextMenu = (e: Event, item: LightNovelChapter) => {
  const target = e.currentTarget as HTMLButtonElement;
  if (contextMenuState.target === target) {
    contextMenuState.show = !contextMenuState.show;
  } else {
    contextMenuState.target = target;
    contextMenuState.show = true;
    contextMenuState.targetData = item;
  }
};

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

const downloadLightNovel = async () => {
  await send(contextMenuState.targetData!.id);
  await downloadStore.addDownloadTaskAction({
    uuid: await trpcClient.getUuid.query(),
    type: "light-novel",
    lightNovelName,
    lightNovelPathWord,
    chapterName: contextMenuState.targetData!.name,
    chapterId: contextMenuState.targetData!.id,
    txtUrl: volumeData.value.results.volume.txt_addr,
    txtEncoding: volumeData.value.results.volume.txt_encoding,
    picUrlList: volumeData.value.results.volume.contents
      .filter((item) => item.content_type === 2 && item.content !== null)
      .map((item) => item.content!),
    filepath: "",
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
      <v-empty-state
        title="出现这个就大概率是出 BUG 了，请提 issue"
        :image="EMPTY_STATE_IMG"
      ></v-empty-state>
    </template>
    <template #default="{ items }">
      <v-row class="wind-p-1">
        <v-col
          v-for="item of items"
          :key="item.raw.id"
          :cols="6"
          :sm="4"
          :md="3"
          :lg="2"
        >
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
                size="large"
                :color="
                  lastReadChapterModel?.chapterUuid === item.raw.id
                    ? 'primary'
                    : undefined
                "
                block
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
                @contextmenu="(e: Event) => showContextMenu(e, item.raw)"
              >
                <app-scroll-wrapper>{{ item.raw.name }}</app-scroll-wrapper>
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
          <v-list-item @click="downloadLightNovel">
            <template #prepend>
              <v-icon small icon="mdi-download"></v-icon>
            </template>
            <template #title>下载</template>
          </v-list-item>
        </v-list>
      </v-menu>
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
