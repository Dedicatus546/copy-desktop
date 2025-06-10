<script setup lang="ts">
import { useRequest } from "alova/client";

import {
  collectAnimelApi,
  getAnimeChapterListApi,
  getAnimeDetailApi,
} from "@/apis";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const { animePathWord } = defineProps<{
  animePathWord: string;
}>();
const userStore = useUserStore();
const snackBar = useSnackbar();
// const localLastReadChapter = useLocalComicLastReadChapter(lightNovelPathWord);
// const lastReadChapter = computed({
//   get() {
//     if (lightNovelReadInfo.value.results.browse) {
//       return {
//         chapterName: lightNovelReadInfo.value.results.browse.chapter_name,
//         chapterUuid: lightNovelReadInfo.value.results.browse.chapter_uuid,
//       };
//     }
//     if (localLastReadChapter.value) {
//       return {
//         chapterName: localLastReadChapter.value.chapterName,
//         chapterUuid: localLastReadChapter.value.chapterUuid,
//       };
//     }
//     return undefined;
//   },
//   set(val) {
//     if (lightNovelReadInfo.value.results.browse) {
//       lightNovelReadInfo.value.results.browse.chapter_name = val!.chapterName;
//       lightNovelReadInfo.value.results.browse.chapter_uuid = val!.chapterUuid;
//     }
//     localLastReadChapter.value = {
//       chapterName: val!.chapterName,
//       chapterUuid: val!.chapterUuid,
//     };
//   },
// });

const { loading, data: animeInfo } = useRequest(() =>
  getAnimeDetailApi(animePathWord),
);
const cover = computed(() =>
  import.meta.env.DEV ? "/360x640.svg" : animeInfo.value.results.cartoon.cover,
);

const { loading: animeChapterLoading, data: animeChapterData } = useRequest(
  () =>
    getAnimeChapterListApi({
      animePathWord,
    }),
);

const activeTabKey = ref("chapter");
const {
  loading: collectLightNovelLoading,
  send: collectLightNovel,
  onSuccess: onCollectLightNovelSuccess,
  data: collectLightNovelData,
} = useRequest(
  () =>
    collectAnimelApi({
      animeId: animeInfo.value.results.cartoon.uuid,
      isCollect: (animeInfo.value.results.collect ?? 0) > 0 ? 0 : 1,
    }),
  {
    immediate: false,
  },
);

onCollectLightNovelSuccess(() => {
  if (animeInfo.value.results.collect) {
    animeInfo.value.results.collect = 0;
  } else {
    animeInfo.value.results.collect = 1;
  }
  snackBar.success(collectLightNovelData.value.message ?? "操作成功");
});

const toAnimeThemePage = (pathWord: string, name: string) => {
  return {
    name: "ANIME_THEME",
    params: {
      themePathWord: pathWord,
      themeName: name,
    },
  };
};

const toAnimeCompanyPage = (pathWord: string, name: string) => {
  return {
    name: "ANIME_COMPANY",
    params: {
      companyPathWord: pathWord,
      companyName: name,
    },
  };
};
</script>

<template>
  <div
    class="wind-flex wind-h-full wind-items-center wind-inset-0 wind-justify-center wind-absolute"
    v-if="loading || !animeInfo || animeChapterLoading || !animeChapterData"
  >
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <v-row v-else>
    <v-col :cols="12">
      <v-card>
        <v-card-text>
          <div class="wind-flex wind-gap-4">
            <div
              class="wind-flex-shrink-0 wind-max-w-[300px] wind-min-w-[200px] wind-w-1/4"
            >
              <v-card variant="text">
                <v-img
                  :aspect-ratio="3 / 4"
                  cover
                  :alt="`${animeInfo.results.cartoon.name}的封面`"
                  :src="cover"
                />
              </v-card>
            </div>
            <div class="wind-flex wind-flex-grow wind-flex-col wind-gap-4">
              <div class="wind-flex wind-gap-2">
                <div class="text-h5">
                  {{ animeInfo.results.cartoon.name }}
                </div>
                <template v-if="animeInfo.results.cartoon.theme.length > 0">
                  <router-link
                    v-for="item of animeInfo.results.cartoon.theme"
                    :key="item.path_word"
                    :to="toAnimeThemePage(item.path_word, item.name)"
                  >
                    <v-chip color="primary">{{ item.name }}</v-chip>
                  </router-link>
                </template>
              </div>
              <div>
                <v-row no-gutters class="wind-gap-3">
                  <v-col v-if="animeInfo.results.cartoon.company" :cols="12">
                    <div class="wind-flex">
                      <div class="wind-text-nowrap">公司：</div>
                      <div class="wind-flex wind-flex-wrap wind-gap-2">
                        <router-link
                          :to="
                            toAnimeCompanyPage(
                              animeInfo.results.cartoon.company.path_word,
                              animeInfo.results.cartoon.company.name,
                            )
                          "
                        >
                          <span class="wind-font-bold">
                            {{ animeInfo.results.cartoon.company.name }}
                          </span>
                        </router-link>
                      </div>
                    </div>
                  </v-col>
                  <v-col :cols="12">
                    <div class="wind-flex wind-gap-1">
                      <div class="wind-text-nowrap">热度：</div>
                      <div class="wind-flex wind-flex-wrap wind-gap-2">
                        {{ animeInfo.results.cartoon.popular }}
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    v-if="animeInfo.results.cartoon.datetime_updated"
                    :cols="12"
                  >
                    <div class="wind-flex wind-gap-1">
                      <div class="wind-text-nowrap">更新时间：</div>
                      <div class="wind-flex wind-flex-wrap wind-gap-2">
                        {{ animeInfo.results.cartoon.datetime_updated }}
                      </div>
                    </div>
                  </v-col>
                  <v-col v-if="animeInfo.results.cartoon.brief" :cols="12">
                    <div class="wind-flex wind-gap-1 wind-items-start">
                      <div class="wind-h-[30px] wind-text-nowrap">简介：</div>
                      <div>
                        {{ animeInfo.results.cartoon.brief }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <div class="wind-mt-auto">
                <v-row>
                  <!-- <v-col
                      v-if="
                        lightNovelReadInfo.results.browse ||
                        localLastReadChapter
                      "
                      :cols="6"
                    > -->
                  <!-- TODO fix route -->
                  <!-- <router-link
                        v-if="lightNovelReadInfo.results.browse"
                        v-slot="{ navigate }"
                        :to="{
                          name: 'COMIC_READ',
                          params: {
                            lightNovelPathWord,
                            seriesId:
                              lightNovelReadInfo.results.browse.chapter_uuid,
                          },
                        }"
                        custom
                      >
                        <v-btn
                          color="primary"
                          variant="flat"
                          size="large"
                          block
                          @click="navigate()"
                        >
                          <template #prepend>
                            <v-icon icon="mdi-book-open"></v-icon>
                          </template>
                          {{ lightNovelReadInfo.results.browse.chapter_name }}
                        </v-btn>
                      </router-link> -->
                  <!-- TODO fix route -->
                  <!-- <router-link
                        v-else-if="localLastReadChapter"
                        v-slot="{ navigate }"
                        :to="{
                          name: 'COMIC_READ',
                          params: {
                            lightNovelPathWord,
                            seriesId: localLastReadChapter.chapterUuid,
                          },
                        }"
                        custom
                      >
                        <v-btn
                          color="primary"
                          variant="flat"
                          size="large"
                          block
                          @click="navigate()"
                        >
                          <template #prepend>
                            <v-icon icon="mdi-book-open"></v-icon>
                          </template>
                          {{ localLastReadChapter.chapterName }}
                        </v-btn>
                      </router-link> -->
                  <!-- </v-col> -->
                  <v-col v-if="userStore.isLogin" :cols="6">
                    <v-btn
                      :loading="collectLightNovelLoading"
                      color="warning"
                      variant="flat"
                      size="large"
                      block
                      @click="collectLightNovel"
                    >
                      <template #prepend>
                        <v-icon icon="mdi-book-heart"></v-icon>
                      </template>
                      {{
                        (animeInfo.results.collect ?? 0) > 0
                          ? "移出收藏"
                          : "加入收藏"
                      }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-tabs v-model:model-value="activeTabKey" bg-color="primary">
          <v-tab value="chapter">集数</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model:model-value="activeTabKey">
            <v-tabs-window-item value="chapter">
              <app-anime-detail-chapter :anime-path-word="animePathWord" />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
