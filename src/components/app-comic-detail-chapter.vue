<script setup lang="ts">
import { usePagination } from "alova/client";

import { ComicChapter, getComicChapterListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";

const { comicPathWord, groupPathWord } = defineProps<{
  comicPathWord: string;
  groupPathWord: string;
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
              >
                <app-scroll-wrapper>
                  {{ item.raw.name }}
                </app-scroll-wrapper>
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
