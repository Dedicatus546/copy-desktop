<script setup lang="ts">
import { Comic } from "@/apis";

defineProps<{
  comic: Comic;
}>();
</script>

<template>
  <v-card color="primary">
    <v-img
      :aspect-ratio="0.777251"
      cover
      :alt="`${comic.name}的封面`"
      :src="comic.cover"
    />
    <v-card-item>
      <v-card-title>{{ comic.name }}</v-card-title>
      <v-card-subtitle class="wind-cursor-default">
        <div class="wind-flex wind-flex-wrap wind-gap-2">
          <!-- TODO route name -->
          <router-link
            v-for="author of comic.author"
            :key="author.path_word"
            :to="{
              name: 'HOME',
              query: { query: author.name },
            }"
          >
            {{ author.name }}
          </router-link>
        </div>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
