<script setup lang="ts">
import { StorageSerializers } from "@vueuse/core";
import { useRequest } from "alova/client";

import {
  collectAnimelApi,
  getAnimeChapterListApi,
  getAnimeDetailApi,
} from "@/apis";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";
import { resolveCover } from "@/utils";

const { animePathWord } = defineProps<{
  animePathWord: string;
}>();
const userStore = useUserStore();
const snackBar = useSnackbar();

const { loading, data: animeInfo } = useRequest(() =>
  getAnimeDetailApi(animePathWord),
);
const cover = computed(() =>
  resolveCover(animeInfo.value.results.cartoon.cover),
);
const brief = computed(() => {
  if (!animeInfo.value) {
    return "";
  }
  return animeInfo.value.results.cartoon.brief
    .split(/\r?\n/)
    .filter((item) => item.trim())
    .map((item) => `<p>${item}</p>`)
    .join("");
});

const localLastReadChapter = useStorage<{
  chapterName: string;
  chapterUuid: string;
  linePathWord: string;
}>(
  computed(() => `anime:lastReadChapter:${animePathWord}`),
  null,
  localStorage,
  // 这里默认值为 null ，必须手动指定序列器
  // 不然 vueuse 无法识别对象类型，导致写入的时候序列化错误
  { serializer: StorageSerializers.object },
);

const lastReadChapter = computed({
  get() {
    if (localLastReadChapter.value) {
      return {
        chapterName: localLastReadChapter.value.chapterName,
        chapterUuid: localLastReadChapter.value.chapterUuid,
        linePathWord: localLastReadChapter.value.linePathWord,
      };
    }
    return undefined;
  },
  set(val) {
    localLastReadChapter.value = {
      chapterName: val!.chapterName,
      chapterUuid: val!.chapterUuid,
      linePathWord: val!.linePathWord,
    };
  },
});

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
            <div
              class="wind-leading-6 wind-flex wind-flex-grow wind-flex-col wind-gap-4"
            >
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
                <v-row no-gutters class="wind-gap-2">
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
                      <div v-html="brief"></div>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <div
                class="wind-mt-auto"
                v-if="lastReadChapter || userStore.isLogin"
              >
                <v-row>
                  <v-col :cols="6" v-if="lastReadChapter">
                    <router-link
                      v-slot="{ navigate }"
                      :to="{
                        name: 'ANIME_WATCH',
                        params: {
                          animePathWord,
                          animeChapterUuid: lastReadChapter.chapterUuid,
                          linePathWord: lastReadChapter.linePathWord,
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
                        {{ lastReadChapter.chapterName }}
                      </v-btn>
                    </router-link>
                  </v-col>
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
              <app-anime-detail-chapter
                v-model:last-read-chapter="lastReadChapter"
                :anime-path-word="animePathWord"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
