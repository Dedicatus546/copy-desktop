<script setup lang="ts">
import { usePagination } from "alova/client";

import { getAnimeChapterListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";

const { animePathWord } = defineProps<{
  animePathWord: string;
}>();

// const lastChapterModel = defineModel<{
//   chapterName: string;
//   chapterUuid: string;
// }>("lastReadChapter");

// const updateLastReadChapter = (series: Series) => {
//   lastChapterModel.value = {
//     chapterUuid: series.uuid,
//     chapterName: series.name,
//   };
// };

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
      <v-list>
        <template v-for="(item, index) of items" :key="item.raw.uuid">
          <v-divider v-if="index > 0"></v-divider>
          <v-list-item>
            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="primary"
                v-for="line of item.raw.lines"
                :key="line.path_word"
              >
                {{ line.name }}
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </template>
  </v-data-iterator>
</template>
