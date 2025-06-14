<script setup lang="ts">
import { usePagination } from "alova/client";

import { getLightNovelVolumeListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";

const { lightNovelPathWord } = defineProps<{
  lightNovelPathWord: string;
}>();

const lastReadChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
}>("lastReadChapter");

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
              >
                <app-scroll-wrapper>{{ item.raw.name }}</app-scroll-wrapper>
              </v-btn>
            </template>
          </router-link>
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
