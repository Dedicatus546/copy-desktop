<script setup lang="ts">
import { useRequest } from "alova/client";

import { getComicPicListApi } from "@/apis";
import useAppStore from "@/stores/use-app-store";

const { comicPathWord, seriesId } = defineProps<{
  comicPathWord: string;
  seriesId: string;
}>();
const appStore = useAppStore();

const { loading, data } = useRequest(() =>
  getComicPicListApi({
    comicPathWord,
    seriesId,
  }),
);

const picList = computed(() => {
  if (!data.value) {
    return [];
  }
  return data.value.results.chapter.contents.map((item) => item.url);
});

// TODO
// const cacheCount = 3;
// const onDecodeSuccess = (index: number) => {
//   const list = data.value.list ?? [];
//   const start = Math.max(0, index - cacheCount);
//   const end = Math.min(index + cacheCount, list.length - 1);
//   for (let i = start; i <= end; i++) {
//     // 缓存前后图片，这样翻页可以立马查看
//     decodeImage(list[i], props.id);
//   }
// };
// provide("onDecodeSuccess", onDecodeSuccess);
</script>

<template>
  <div
    v-if="loading"
    class="wind-flex wind-items-center wind-inset-0 wind-justify-center wind-absolute"
  >
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <template v-else>
    <app-comic-scroll-read
      v-if="appStore.config.readMode === 0"
      :pic-list="picList"
    />
    <app-comic-page-read v-else :pic-list="picList" />
  </template>
</template>
