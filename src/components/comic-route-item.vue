<script setup lang="ts">
import { Comic } from "@/apis";

withDefaults(
  defineProps<{
    comic: Comic;
    replace?: boolean;
  }>(),
  {
    replace: false,
  },
);
</script>

<template>
  <router-link
    :to="{
      name: 'COMIC_DETAIL',
      params: { comicPathWord: comic.path_word },
      replace,
    }"
  >
    <comic-base-item :comic="comic"></comic-base-item>
  </router-link>
</template>

<style scoped></style>
