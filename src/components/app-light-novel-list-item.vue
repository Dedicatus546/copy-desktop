<script setup lang="ts">
import { LightNovel } from "@/apis";
import { resolveCover } from "@/utils";

const props = withDefaults(
  defineProps<{
    lightNovel: LightNovel;
    replace?: boolean;
  }>(),
  {
    replace: false,
  },
);

const cover = computed(() => resolveCover(props.lightNovel.cover));
</script>

<template>
  <router-link
    :to="{
      name: 'LIGHT_NOVEL_DETAIL',
      params: { lightNovelPathWord: lightNovel.path_word },
      replace,
    }"
  >
    <v-card color="primary">
      <v-img
        :aspect-ratio="3 / 4"
        cover
        :alt="`${lightNovel.name}的封面`"
        :src="cover"
      />
      <v-card-item>
        <v-card-title>{{ lightNovel.name }}</v-card-title>
        <v-card-subtitle class="wind-cursor-default">
          <app-scroll-wrapper>
            <router-link
              v-for="author of lightNovel.author"
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
