<script setup lang="ts">
import { Comic } from "@/apis";

defineProps<{
  comic: Comic;
}>();

const authorListContainerElRef = useTemplateRef("authorListContainerRef");
const authorListInnerElRef = useTemplateRef("authorListInnerElRef");
const authorListContainerElWidth = ref(0);
const authorListInnerElWidth = ref(0);

useResizeObserver(authorListContainerElRef, ([entry]) => {
  const { width } = entry.contentRect;
  authorListContainerElWidth.value = width;
});

useResizeObserver(authorListInnerElRef, ([entry]) => {
  const { width } = entry.contentRect;
  authorListInnerElWidth.value = width;
});

const { play, pause, animate } = useAnimate(
  authorListInnerElRef,
  computed(() => {
    return [
      {
        transform: "translate3d(0, 0, 0)",
        offset: 0,
      },
      {
        transform: "translate3d(0, 0, 0)",
        offset: 0.3,
      },
      {
        transform: `translate3d(${-authorListInnerElWidth.value + authorListContainerElWidth.value}px, 0, 0)`,
        offset: 0.5,
      },
      {
        transform: `translate3d(${-authorListInnerElWidth.value + authorListContainerElWidth.value}px, 0, 0)`,
        offset: 0.8,
      },
      {
        transform: "translate3d(0, 0, 0)",
        offset: 1,
      },
    ];
  }),
  {
    immediate: false,
    duration: 1000,
    iterations: Infinity,
    easing: "linear",
  },
);

watch(
  () => [authorListInnerElWidth.value, authorListContainerElWidth.value],
  ([innerWidth, containerWidth]) => {
    if (innerWidth - containerWidth < 0) {
      pause();
      return;
    }
    const duration =
      containerWidth === 0
        ? 0
        : Math.floor(innerWidth / containerWidth) * 10000;
    animate.value?.effect?.updateTiming({
      duration: duration <= 0 ? "auto" : duration,
    });
    play();
  },
);
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
        <div class="wind-max-w-full" ref="authorListContainerRef">
          <div
            ref="authorListInnerElRef"
            class="wind-inline-flex wind-gap-2 wind-truncate"
          >
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
          </div>
        </div>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
