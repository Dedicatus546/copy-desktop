<script setup lang="ts">
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { Fancybox } from "@fancyapps/ui";
import { zh_CN } from "@fancyapps/ui/l10n/Fancybox/zh_CN";
import { useRequest } from "alova/client";

import { getLightNovelTxtContentApi, getLightNovelVolumeApi } from "@/apis";

const { lightNovelPathWord, chapterId } = defineProps<{
  lightNovelPathWord: string;
  chapterId: string;
}>();

const {
  loading: volumeLoading,
  data,
  onSuccess,
} = useRequest(() =>
  getLightNovelVolumeApi({
    lightNovelPathWord,
    chapterId,
  }),
);

const {
  loading: contentLoading,
  data: txtContentData,
  send,
} = useRequest(
  () => getLightNovelTxtContentApi(data.value.results.volume.txt_addr),
  {
    immediate: false,
    initialData: {
      results: "",
    },
  },
);

onSuccess(send);

const sliderValue = ref(0);
const currentIndex = ref(0);
const txtlist = computed(() => {
  const lineList = txtContentData.value.results.split(/\r?\n/);
  return data.value.results.volume.contents
    .filter((item) => item.content_type === 1)
    .map((item) => {
      return {
        ...item,
        content: lineList.slice(item.start_lines, item.end_lines).join("<br>"),
      };
    });
});

const imageList = computed(() => {
  return data.value.results.volume.contents
    .filter((item) => item.content_type === 2 && item.content !== null)
    .map((item) => item.content!);
});

const currentItem = computed(() => {
  if (txtlist.value.length === 0) {
    return null;
  }
  return txtlist.value[currentIndex.value];
});

const hasLastPage = computed(() => currentIndex.value > 0);
const lastPage = () => {
  if (currentIndex.value === 0) {
    return;
  }
  currentIndex.value--;
  sliderValue.value = currentIndex.value + 1;
};

const hasNextPage = computed(
  () => currentIndex.value < txtlist.value.length - 1,
);
const nextPage = () => {
  if (currentIndex.value === txtlist.value.length - 1) {
    return;
  }
  currentIndex.value++;
  sliderValue.value = currentIndex.value + 1;
};

onKeyStroke("ArrowRight", () => nextPage(), {
  dedupe: true,
});
onKeyStroke("ArrowLeft", () => lastPage(), {
  dedupe: true,
});

// TODO 监听上下然后翻一页
onKeyStroke("ArrowUp", () => {}, {
  dedupe: true,
});
onKeyStroke("ArrowDown", () => {}, {
  dedupe: true,
});

const onSliderEnd = (value: [number, number] | number) => {
  currentIndex.value = (value as number) - 1;
};

const imageNodeListRef = useTemplateRef("imageNodeListRef");
const showFancyBox = () => {
  if (imageNodeListRef.value) {
    Fancybox.fromNodes(imageNodeListRef.value, {
      l10n: zh_CN,
    });
  }
};
</script>

<template>
  <div
    v-if="volumeLoading || contentLoading"
    class="wind-bg-[rgb(var(--v-theme-read-bg))] wind-flex wind-items-center wind-inset-0 wind-justify-center wind-absolute"
  >
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <div
    class="wind-text-[rgb(var(--v-theme-read-text))] wind-bg-[rgb(var(--v-theme-read-bg))] wind-flex wind-flex-col wind-gap-2 wind-inset-0 wind-absolute"
    v-else-if="currentItem"
  >
    <h3 class="text-h5 wind-p8 wind-text-center">
      {{ currentItem.name }}
    </h3>
    <div class="wind-p-8 wind-flex-grow wind-h-0 wind-overflow-y-auto">
      <div v-html="currentItem.content"></div>
    </div>
    <div>
      <v-divider />
      <v-card color="transparent" :elevation="0">
        <v-card-text>
          <v-slider
            v-model:model-value="sliderValue"
            hide-details
            :step="1"
            :min="1"
            :max="txtlist.length"
            @end="onSliderEnd"
          >
            <template #prepend>
              <v-btn
                variant="text"
                icon="mdi-arrow-left"
                size="large"
                :disabled="!hasLastPage"
                @click="lastPage"
              ></v-btn>
            </template>
            <template #append>
              <div class="wind-flex wind-gap-2 wind-items-center">
                <div>第 {{ currentIndex + 1 }} / {{ txtlist.length }} 章</div>
                <v-btn
                  variant="text"
                  icon="mdi-image"
                  size="large"
                  @click="showFancyBox"
                ></v-btn>
                <v-btn
                  variant="text"
                  icon="mdi-arrow-right"
                  size="large"
                  :disabled="!hasNextPage"
                  @click="nextPage"
                >
                </v-btn>
              </div>
            </template>
          </v-slider>
        </v-card-text>
      </v-card>
    </div>
    <div class="wind-hidden">
      <a
        data-fancybox="pic-list"
        :href="image"
        v-for="image of imageList"
        :key="image"
        ref="imageNodeListRef"
      >
        <v-img cover :src="image"></v-img>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
