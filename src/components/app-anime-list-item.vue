<script setup lang="ts">
import { resolveCover } from "@/utils";

const props = withDefaults(
  defineProps<{
    anime: {
      name: string;
      path_word: string;
      cover: string;
      company?: {
        name: string;
        path_word: string;
      };
    };
    replace?: boolean;
  }>(),
  {
    replace: false,
  },
);

const cover = computed(() => resolveCover(props.anime.cover));
</script>

<template>
  <router-link
    :to="{
      name: 'ANIME_DETAIL',
      params: { animePathWord: anime.path_word },
      replace,
    }"
  >
    <v-card color="primary">
      <v-img
        :aspect-ratio="3 / 4"
        cover
        :alt="`${anime.name}的封面`"
        :src="cover"
      />
      <v-card-item>
        <v-card-title>{{ anime.name }}</v-card-title>
        <v-card-subtitle v-if="anime.company">
          <app-scroll-wrapper>
            <router-link
              :to="{
                name: 'ANIME_COMPANY',
                params: {
                  companyPathWord: anime.company.path_word,
                  companyName: anime.company.name,
                },
              }"
            >
              {{ anime.company.name }}
            </router-link>
          </app-scroll-wrapper>
        </v-card-subtitle>
      </v-card-item>
    </v-card>
  </router-link>
</template>

<style scoped></style>
