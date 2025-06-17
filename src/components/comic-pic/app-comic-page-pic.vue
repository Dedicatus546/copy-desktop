<script setup lang="ts">
const { src } = defineProps<{
  src: string;
}>();

const isLoaded = ref(false);
</script>

<template>
  <div
    class="wind-h-full wind-w-full"
    :class="{ 'wind-aspect-[9/16]': !isLoaded }"
  >
    <img
      class="wind-h-full wind-w-full wind-block wind-object-contain"
      :src="src"
      alt=""
      @load="isLoaded = true"
    />
  </div>
</template>

<style scoped></style>
