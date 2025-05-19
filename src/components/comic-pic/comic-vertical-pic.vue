<script setup lang="ts">
import scrollIntoViewIfNeed from "scroll-into-view-if-needed";

const { src } = defineProps<{
  src: string;
}>();
const emits = defineEmits<{
  (e: "intersect"): void;
}>();

const elRef = ref<HTMLDivElement | null>(null);
const isLoaded = ref(false);

const onScrollImageIntersect = (isIntersecting: boolean) => {
  if (isIntersecting) {
    emits("intersect");
  }
};

defineExpose({
  scrollIntoView() {
    if (elRef.value) {
      scrollIntoViewIfNeed(elRef.value, {
        block: "start",
      });
    }
  },
});
</script>

<template>
  <div
    ref="elRef"
    class="wind-relative"
    :class="{ 'wind-aspect-[9/16]': !isLoaded }"
  >
    <div
      v-intersect="{
        handler: onScrollImageIntersect,
        options: {
          rootMargin: '-50% 0% -50% 0%',
        },
      }"
      class="wind-absolute wind-inset-0"
    ></div>
    <v-img :src="src" alt="" @load="isLoaded = true" />
  </div>
</template>

<style scoped></style>
