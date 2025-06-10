<script setup lang="ts">
import { useRequest } from "alova/client";

import {
  collectComicApi,
  commentComicApi,
  getComicCommentListApi,
  getComicDetailApi,
  getComicReadDetailApi,
} from "@/apis";
import useLocalComicLastReadChapter from "@/compositions/use-local-comic-last-read-chapter";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const { comicPathWord } = defineProps<{
  comicPathWord: string;
}>();
const userStore = useUserStore();
const snackBar = useSnackbar();
const localLastReadChapter = useLocalComicLastReadChapter(comicPathWord);
const lastReadChapter = computed({
  get() {
    if (comicReadInfo.value.results.browse) {
      return {
        chapterName: comicReadInfo.value.results.browse.chapter_name,
        chapterUuid: comicReadInfo.value.results.browse.chapter_uuid,
      };
    }
    if (localLastReadChapter.value) {
      return {
        chapterName: localLastReadChapter.value.chapterName,
        chapterUuid: localLastReadChapter.value.chapterUuid,
      };
    }
    return undefined;
  },
  set(val) {
    if (comicReadInfo.value.results.browse) {
      comicReadInfo.value.results.browse.chapter_name = val!.chapterName;
      comicReadInfo.value.results.browse.chapter_uuid = val!.chapterUuid;
    }
    localLastReadChapter.value = {
      chapterName: val!.chapterName,
      chapterUuid: val!.chapterUuid,
    };
  },
});

const {
  loading,
  data: comicInfo,
  send,
} = useRequest((pathWord: string) => getComicDetailApi(pathWord), {
  immediate: false,
});
const cover = computed(() =>
  import.meta.env.DEV ? "/360x640.svg" : comicInfo.value.results.comic.cover,
);

const { loading: comicReadInfoLoading, data: comicReadInfo } = useRequest(() =>
  getComicReadDetailApi({
    comicPathWord,
  }),
);

watchEffect(() => {
  send(comicPathWord);
});

const activeTabKey = ref("");
const seriesTabList = computed(() => {
  if (!comicInfo.value) {
    return [];
  }
  return Object.values(comicInfo.value.results.groups).map((item) => ({
    label: item.name,
    value: item.path_word,
    total: item.count,
  }));
});

const {
  loading: collectComicLoading,
  send: collectComic,
  onSuccess: onCollectComicSuccess,
  data: collectComicData,
} = useRequest(
  () =>
    collectComicApi({
      comicId: comicInfo.value.results.comic.uuid,
      isCollect: (comicReadInfo.value.results.collect ?? 0) > 0 ? 0 : 1,
    }),
  {
    immediate: false,
  },
);

onCollectComicSuccess(() => {
  if (comicReadInfo.value.results.collect) {
    comicReadInfo.value.results.collect = 0;
  } else {
    comicReadInfo.value.results.collect = 1;
  }
  snackBar.success(collectComicData.value.message ?? "操作成功");
});

const toComicThemePage = (pathWord: string, name: string) => {
  return {
    name: "COMIC_THEME",
    params: {
      themePathWord: pathWord,
      themeName: name,
    },
  };
};

const toComicAuthorPage = (pathWord: string, name: string) => {
  return {
    name: "COMIC_AUTHOR",
    params: {
      authorPathWord: pathWord,
      authorName: name,
    },
  };
};

const getComicCommentListApiWrapper = (query: {
  offset: number;
  limit: number;
  replyId?: number;
}) => {
  return getComicCommentListApi({
    comicId: comicInfo.value.results.comic.uuid,
    ...query,
  });
};

const commentComicApiWrapper = (query: {
  comment: string;
  replyId?: number;
}) => {
  return commentComicApi({
    comicId: comicInfo.value.results.comic.uuid,
    ...query,
  });
};
</script>

<template>
  <v-row>
    <v-col
      v-if="loading || comicReadInfoLoading || !comicInfo || !comicReadInfo"
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
                    cover
                    :alt="`${comicInfo.results.comic.name}的封面`"
                    :src="cover"
                  />
                </v-card>
              </div>
              <div class="wind-flex wind-flex-grow wind-flex-col wind-gap-4">
                <div class="wind-flex wind-gap-2">
                  <div class="text-h5">{{ comicInfo.results.comic.name }}</div>
                  <template v-if="comicInfo.results.comic.theme.length > 0">
                    <router-link
                      v-for="item of comicInfo.results.comic.theme"
                      :key="item.path_word"
                      :to="toComicThemePage(item.path_word, item.name)"
                    >
                      <v-chip color="primary">{{ item.name }}</v-chip>
                    </router-link>
                  </template>
                </div>
                <div>
                  <v-row no-gutters class="wind-gap-3">
                    <v-col
                      v-if="comicInfo.results.comic.author.length > 0"
                      :cols="12"
                    >
                      <div class="wind-flex">
                        <div class="wind-text-nowrap">作者：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          <router-link
                            v-for="item of comicInfo.results.comic.author"
                            :key="item.path_word"
                            :to="toComicAuthorPage(item.path_word, item.name)"
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
                          {{ comicInfo.results.comic.status.display }}
                        </div>
                      </div>
                    </v-col>
                    <v-col :cols="12">
                      <div class="wind-flex wind-gap-1">
                        <div class="wind-text-nowrap">热度：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          {{ comicInfo.results.comic.popular }}
                        </div>
                      </div>
                    </v-col>
                    <v-col
                      v-if="comicInfo.results.comic.datetime_updated"
                      :cols="12"
                    >
                      <div class="wind-flex wind-gap-1">
                        <div class="wind-text-nowrap">更新时间：</div>
                        <div class="wind-flex wind-flex-wrap wind-gap-2">
                          {{ comicInfo.results.comic.datetime_updated }}
                        </div>
                      </div>
                    </v-col>
                    <v-col v-if="comicInfo.results.comic.brief" :cols="12">
                      <div class="wind-flex wind-gap-1 wind-items-start">
                        <div class="wind-h-[30px] wind-text-nowrap">简介：</div>
                        <div>
                          {{ comicInfo.results.comic.brief }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="wind-mt-auto">
                  <v-row>
                    <v-col
                      v-if="
                        comicReadInfo.results.browse || localLastReadChapter
                      "
                      :cols="6"
                    >
                      <router-link
                        v-if="comicReadInfo.results.browse"
                        v-slot="{ navigate }"
                        :to="{
                          name: 'COMIC_READ',
                          params: {
                            comicPathWord,
                            seriesId: comicReadInfo.results.browse.chapter_uuid,
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
                          {{ comicReadInfo.results.browse.chapter_name }}
                        </v-btn>
                      </router-link>
                      <router-link
                        v-else-if="localLastReadChapter"
                        v-slot="{ navigate }"
                        :to="{
                          name: 'COMIC_READ',
                          params: {
                            comicPathWord,
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
                      </router-link>
                    </v-col>
                    <v-col v-if="userStore.isLogin" :cols="6">
                      <v-btn
                        :loading="collectComicLoading"
                        color="warning"
                        variant="flat"
                        size="large"
                        block
                        @click="collectComic"
                      >
                        <template #prepend>
                          <v-icon icon="mdi-book-heart"></v-icon>
                        </template>
                        {{
                          (comicReadInfo.results.collect ?? 0) > 0
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
            <v-tab
              v-for="item of seriesTabList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </v-tab>
            <v-tab value="comment">评论</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model:model-value="activeTabKey">
              <v-tabs-window-item
                v-for="item of seriesTabList"
                :key="item.value"
                :value="item.value"
              >
                <app-comic-detail-series
                  v-model:last-read-chapter="lastReadChapter"
                  :comic-path-word="comicInfo.results.comic.path_word"
                  :series-path-word="item.value"
                  :total="item.total"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="comment">
                <app-comment
                  :get-comment-list-api="getComicCommentListApiWrapper"
                  :comment-api="commentComicApiWrapper"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>
