<script setup lang="ts">
const props = withDefaults(
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

const cover = computed(() =>
  import.meta.env.DEV ? "/360x640.svg" : props.anime.cover,
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
        :aspect-ratio="3 / 4"
        cover
        :alt="`${anime.name}的封面`"
        :src="cover"
      />
      <v-card-item>
        <v-card-title>{{ anime.name }}</v-card-title>
      </v-card-item>
    </v-card>
  </router-link>
</template>

<style scoped></style>
