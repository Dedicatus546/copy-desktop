<script setup lang="ts">
import { usePagination } from "alova/client";

import { getComicSeriesListApi, Series } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";

const { comicPathWord, seriesPathWord } = defineProps<{
  comicPathWord: string;
  seriesPathWord: string;
}>();

const lastChapterModel = defineModel<{
  chapterName: string;
  chapterUuid: string;
}>("lastReadChapter");

const updateLastReadChapter = (series: Series) => {
  lastChapterModel.value = {
    chapterUuid: series.uuid,
    chapterName: series.name,
  };
};

const { loading, data, page, pageSize, total } = usePagination(
  (page, pageSize) =>
    getComicSeriesListApi({
      comicPathWord,
      seriesPathWord,
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
const seriesTabList = computed(() => {
  const count = Math.ceil((total.value ?? 0) / pageSize.value);
  const r = [];
  for (let i = 0; i < count; i++) {
    const start = i * pageSize.value + 1;
    const end = (i + 1) * pageSize.value;
    r.push({
      label: `${start} - ${end}`,
      value: i + 1, // page 索引
    });
  }
  return r;
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
        <v-col v-if="seriesTabList.length > 1" :cols="12">
          <v-tabs v-model:model-value="page" bg-color="transparent">
            <v-tab
              v-for="item of seriesTabList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </v-tab>
          </v-tabs>
        </v-col>
        <template v-for="item of items" :key="item.raw.id">
          <v-col :cols="6" :sm="4" :md="3" :lg="2">
            <router-link
              :to="{
                name: 'COMIC_READ',
                params: {
                  comicPathWord: item.raw.comic_path_word,
                  seriesId: item.raw.uuid,
                },
              }"
              custom
            >
              <template #default="{ navigate }">
                <v-btn
                  size="large"
                  :color="
                    lastChapterModel?.chapterUuid === item.raw.uuid
                      ? 'primary'
                      : undefined
                  "
                  block
                  @click="() => (updateLastReadChapter(item.raw), navigate())"
                >
                  {{ item.raw.name }}
                </v-btn>
              </template>
            </router-link>
          </v-col>
        </template>
      </v-row>
    </template>
  </v-data-iterator>
</template>
