<script setup lang="ts">
const { src } = defineProps<{
  src: string;
}>();

const isLoaded = ref(false);
</script>

<template>
  <div
    class="wind-w-full wind-h-full"
    :class="{ 'wind-aspect-[9/16]': !isLoaded }"
  >
    <img
      class="wind-block wind-w-full wind-h-full wind-object-contain"
      :src="src"
      alt=""
      @load="isLoaded = true"
    />
  </div>
</template>

<style scoped></style>
