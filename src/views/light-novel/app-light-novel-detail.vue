<script setup lang="ts">
import { useRequest } from "alova/client";

import {
  collectLightNovelApi,
  getLightNovelDetailApi,
  getLightNovelReadDetailApi,
} from "@/apis";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const { lightNovelPathWord } = defineProps<{
  lightNovelPathWord: string;
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

const { loading, data: lightNovelInfo } = useRequest(() =>
  getLightNovelDetailApi(lightNovelPathWord),
);

const { loading: lightNovelReadInfoLoading, data: lightNovelReadInfo } =
  useRequest(() =>
    getLightNovelReadDetailApi({
      lightNovelPathWord,
    }),
  );

const activeTabKey = ref("");
// TODO
const {
  loading: collectLightNovelLoading,
  send: collectLightNovel,
  onSuccess: onCollectLightNovelSuccess,
  data: collectLightNovelData,
} = useRequest(
  () =>
    collectLightNovelApi({
      lightNovelId: lightNovelPathWord,
      isCollect: (lightNovelReadInfo.value.results.collect ?? 0) > 0 ? 0 : 1,
    }),
  {
    immediate: false,
  },
);

onCollectLightNovelSuccess(() => {
  snackBar.success(collectLightNovelData.value.message ?? "操作成功");
});

const toLightNovelThemePage = (pathWord: string, name: string) => {
  return {
    name: "LIGHT_NOVEL_THEME",
    params: {
      themePathWord: pathWord,
      themeName: name,
    },
  };
};

const toLightNovelAuthorPage = (pathWord: string, name: string) => {
  return {
    name: "LIGHT_NOVEL_AUTHOR",
    params: {
      authorPathWord: pathWord,
      authorName: name,
    },
  };
};
</script>

<template>
  <v-row>
    <v-col
      v-if="
        loading ||
        lightNovelReadInfoLoading ||
        !lightNovelInfo ||
        !lightNovelReadInfo
      "
      :cols="12"
    >
      <div
        class="wind-flex wind-h-[30vh] wind-items-center wind-justify-center"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-col>
    <template v-else>
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
                    :alt="`${lightNovelInfo.results.book.name}的封面`"
                    :src="lightNovelInfo.results.book.cover"
                  />
                </v-card>
              </div>
              <div class="wind-flex wind-flex-grow wind-flex-col wind-gap-4">
                <div class="wind-flex wind-gap-2">
                  <div class="text-h5">
                    {{ lightNovelInfo.results.book.name }}
                  </div>
                  <template v-if="lightNovelInfo.results.book.theme.length > 0">
                    <router-link
                      v-for="item of lightNovelInfo.results.book.theme"
                      :key="item.path_word"
                      :to="toLightNovelThemePage(item.path_word, item.name)"
                    >
                      <v-chip color="primary">{{ item.name }}</v-chip>
                    </router-link>
                  </template>
                </div>
                <div>
                  <v-row no-gutters class="wind-gap-3">
                    <v-col
                      v-if="lightNovelInfo.results.book.author.length > 0"
                      :cols="12"
                    >
                      <div class="wind-flex">
                        <div class="wind-text-nowrap">作者：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          <router-link
                            v-for="item of lightNovelInfo.results.book.author"
                            :key="item.path_word"
                            :to="
                              toLightNovelAuthorPage(item.path_word, item.name)
                            "
                          >
                            <span class="wind-font-bold">
                              {{ item.name }}
                            </span>
                          </router-link>
                        </div>
                      </div>
                    </v-col>
                    <v-col :cols="12">
                      <div class="wind-flex">
                        <div class="wind-text-nowrap">状态：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          {{ lightNovelInfo.results.book.status.display }}
                        </div>
                      </div>
                    </v-col>
                    <v-col :cols="12">
                      <div class="wind-flex wind-gap-1">
                        <div class="wind-text-nowrap">热度：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          {{ lightNovelInfo.results.book.popular }}
                        </div>
                      </div>
                    </v-col>
                    <v-col
                      v-if="lightNovelInfo.results.book.datetime_updated"
                      :cols="12"
                    >
                      <div class="wind-flex wind-gap-1">
                        <div class="wind-text-nowrap">更新时间：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          {{ lightNovelInfo.results.book.datetime_updated }}
                        </div>
                      </div>
                    </v-col>
                    <v-col v-if="lightNovelInfo.results.book.brief" :cols="12">
                      <div class="wind-flex wind-gap-1 wind-items-start">
                        <div class="wind-h-[30px] wind-text-nowrap">简介：</div>
                        <div>
                          {{ lightNovelInfo.results.book.brief }}
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
                          (lightNovelReadInfo.results.collect ?? 0) > 0
                            ? "移出书架"
                            : "加入书架"
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
            <v-tab value="volume">章节</v-tab>
            <v-tab value="comment">评论</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model:model-value="activeTabKey">
              <v-tabs-window-item value="volume"></v-tabs-window-item>
              <v-tabs-window-item value="comment"></v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>
