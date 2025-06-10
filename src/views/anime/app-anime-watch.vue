<script setup lang="ts">
import { useRequest } from "alova/client";
import Artplayer from "artplayer";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import Hls from "hls.js";

import { getAnimeChapterDetailApi } from "@/apis";

const { animeChapterUuid, animePathWord, linePathWord } = defineProps<{
  animePathWord: string;
  animeChapterUuid: string;
  linePathWord: string;
}>();

const artPlayerInst = ref<Artplayer | null>(null);
const videoContainerRef = useTemplateRef("videoContainerRef");

const { loading, data, onSuccess } = useRequest(() =>
  getAnimeChapterDetailApi({
    animeChapterUuid,
    animePathWord,
    linePathWord,
  }),
);

onSuccess(async () => {
  await nextTick();
  if (videoContainerRef.value) {
    artPlayerInst.value = new Artplayer({
      container: videoContainerRef.value,
      url: data.value.results.chapter.video,
      type: "m3u8",
      poster: data.value.results.chapter.v_cover,
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      // subtitleOffset: true,
      fullscreen: true,
      fullscreenWeb: true,
      screenshot: true,
      pip: true,
      theme: "#1e90ff",
      plugins: [
        artplayerPluginHlsControl({
          // quality: {
          //   // Show qualitys in control
          //   control: true,
          //   // Show qualitys in setting
          //   setting: true,
          //   // Get the quality name from level
          //   getName: (level) => level.height + "P",
          //   // I18n
          //   title: "Quality",
          //   auto: "Auto",
          // },
          // audio: {
          //   // Show audios in control
          //   control: true,
          //   // Show audios in setting
          //   setting: true,
          //   // Get the audio name from track
          //   getName: (track) => track.name,
          //   // I18n
          //   title: "Audio",
          //   auto: "Auto",
          // },
        }),
      ],
      customType: {
        m3u8(video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "该设备不支持播放 m3u8 文件";
          }
        },
      },
    });
  }
});

onBeforeUnmount(() => {
  artPlayerInst.value?.destroy();
});
</script>

<template>
  <div
    v-if="loading"
    class="wind-flex wind-items-center wind-inset-0 wind-justify-center wind-absolute"
  >
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <div
    ref="videoContainerRef"
    class="wind-flex wind-items-center wind-inset-0 wind-justify-center wind-absolute"
  ></div>
</template>

<style scoped lang="scss"></style>
