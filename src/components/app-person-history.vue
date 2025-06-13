<script setup lang="ts">
import AppPersonHistoryAnime from "./app-person-history-anime.vue";
import AppPersonHistoryComic from "./app-person-history-comic.vue";
import AppPersonHistoryLightNovel from "./app-person-history-light-novel.vue";

const bookshelfTab = ref("comic");
const bookshelfTabList = [
  { label: "漫画", value: "comic", component: AppPersonHistoryComic },
  {
    label: "轻小说",
    value: "light-novel",
    component: AppPersonHistoryLightNovel,
  },
  {
    label: "动画",
    value: "anime",
    component: AppPersonHistoryAnime,
  },
] as const;
</script>

<template>
  <v-tabs v-model:model-value="bookshelfTab" bg-color="transparent" grow>
    <v-tab
      v-for="item in bookshelfTabList"
      :key="item.value"
      :text="item.label"
      :value="item.value"
    ></v-tab>
  </v-tabs>
  <v-card-text>
    <v-tabs-window v-model:model-value="bookshelfTab">
      <v-tabs-window-item
        v-for="item in bookshelfTabList"
        :key="item.value"
        :value="item.value"
      >
        <component :is="item.component"></component>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card-text>
</template>
