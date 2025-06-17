<script setup lang="ts">
defineProps<{
  picList: Array<string>;
}>();

const sliderValue = ref(0);
const comicVerticalPicListRef = ref<Array<{ scrollIntoView: () => void }>>([]);

const onSliderEnd = (value: number) => {
  const index = value - 1;
  comicVerticalPicListRef.value?.[index].scrollIntoView();
};
</script>

<template>
  <div class="wind-flex wind-flex-col wind-inset-0 wind-absolute">
    <div class="wind-p-4 wind-flex-grow wind-min-h-0 wind-overflow-auto">
      <comic-vertical-pic
        v-for="(item, index) of picList"
        ref="comicVerticalPicListRef"
        :key="item"
        :src="item"
        @intersect="sliderValue = index + 1"
      />
    </div>
    <div class="wind-flex-shrink-0">
      <v-divider />
      <v-card color="transparent" :elevation="0">
        <v-card-text>
          <v-slider
            v-model:model-value="sliderValue"
            hide-details
            :step="1"
            color="primary"
            :min="1"
            :max="picList.length"
            @end="onSliderEnd"
          >
            <template #append>
              <div class="wind-flex wind-gap-2 wind-items-center">
                <div>{{ sliderValue }} / {{ picList.length }}</div>
              </div>
            </template>
          </v-slider>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
