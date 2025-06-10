<script setup lang="ts">
import { Comic } from "@/apis";
import { resolveCover } from "@/utils";

const props = withDefaults(
  defineProps<{
    comic: Comic;
    replace?: boolean;
  }>(),
  {
    replace: false,
  },
);

const cover = computed(() => resolveCover(props.comic.cover));
</script>

<template>
  <router-link
    :to="{
      name: 'COMIC_DETAIL',
      params: { comicPathWord: comic.path_word },
      replace,
    }"
  >
    <v-card color="primary">
      <v-img
        :aspect-ratio="3 / 4"
        cover
        :alt="`${comic.name}的封面`"
        :src="cover"
      />
      <v-card-item>
        <v-card-title>{{ comic.name }}</v-card-title>
        <v-card-subtitle class="wind-cursor-default">
          <app-scroll-wrapper>
            <router-link
              v-for="author of comic.author"
              :key="author.path_word"
              :to="{
                name: 'COMIC_AUTHOR',
                params: {
                  authorPathWord: author.path_word,
                  authorName: author.name,
                },
              }"
            >
              {{ author.name }}
            </router-link>
          </app-scroll-wrapper>
        </v-card-subtitle>
      </v-card-item>
    </v-card>
  </router-link>
</template>

<style scoped></style>
