<script setup lang="ts">
withDefaults(
  defineProps<{
    anime: {
      name: string;
      path_word: string;
      cover: string;
    };
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
      name: 'ANIME_DETAIL',
      params: { animePathWord: anime.path_word },
      replace,
    }"
  >
    <v-card color="primary">
      <v-img
        :aspect-ratio="0.777251"
        cover
        :alt="`${anime.name}的封面`"
        :src="anime.cover"
      />
      <v-card-item>
        <v-card-title>{{ anime.name }}</v-card-title>
      </v-card-item>
    </v-card>
  </router-link>
</template>

<style scoped></style>
