<script setup lang="ts">
import { StorageSerializers } from "@vueuse/core";
import { useRequest } from "alova/client";

import {
  collectLightNovelApi,
  commentLightNovelApi,
  getLightNovelCommentListApi,
  getLightNovelDetailApi,
  getLightNovelReadDetailApi,
} from "@/apis";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";
import { resolveCover } from "@/utils";

const { lightNovelPathWord } = defineProps<{
  lightNovelPathWord: string;
}>();
const userStore = useUserStore();
const snackBar = useSnackbar();
const localLastReadChapter = useStorage<{
  chapterName: string;
  chapterUuid: string;
}>(
  computed(() => `lightNovel:lastReadChapter:${lightNovelPathWord}`),
  null,
  localStorage,
  // 这里默认值为 null ，必须手动指定序列器
  // 不然 vueuse 无法识别对象类型，导致写入的时候序列化错误
  { serializer: StorageSerializers.object },
);

const lastReadChapter = computed({
  get() {
    if (lightNovelReadInfo.value.results.browse) {
      return {
        chapterName: lightNovelReadInfo.value.results.browse.chapter_name,
        chapterUuid: lightNovelReadInfo.value.results.browse.chapter_id,
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
    if (userStore.isLogin) {
      lightNovelReadInfo.value.results.browse = {
        book_id: lightNovelInfo.value.results.book.uuid,
        path_word: lightNovelPathWord,
        chapter_name: val!.chapterName,
        chapter_id: val!.chapterUuid,
      };
    } else {
      localLastReadChapter.value = {
        chapterName: val!.chapterName,
        chapterUuid: val!.chapterUuid,
      };
    }
  },
});

const { loading, data: lightNovelInfo } = useRequest(() =>
  getLightNovelDetailApi(lightNovelPathWord),
);
const cover = computed(() =>
  resolveCover(lightNovelInfo.value.results.book.cover),
);
const brief = computed(() => {
  if (!lightNovelInfo.value) {
    return "";
  }
  return lightNovelInfo.value.results.book.brief
    .split(/\r?\n/)
    .filter((item) => item.trim())
    .map((item) => `<p>${item}</p>`)
    .join("");
});

const { loading: lightNovelReadInfoLoading, data: lightNovelReadInfo } =
  useRequest(() =>
    getLightNovelReadDetailApi({
      lightNovelPathWord,
    }),
  );

const activeTabKey = ref("");

const {
  loading: collectLightNovelLoading,
  send: collectLightNovel,
  onSuccess: onCollectLightNovelSuccess,
  data: collectLightNovelData,
} = useRequest(
  () =>
    collectLightNovelApi({
      lightNovelId: lightNovelInfo.value.results.book.uuid,
      isCollect: (lightNovelReadInfo.value.results.collect ?? 0) > 0 ? 0 : 1,
    }),
  {
    immediate: false,
  },
);

onCollectLightNovelSuccess(() => {
  if (lightNovelReadInfo.value.results.collect) {
    lightNovelReadInfo.value.results.collect = 0;
  } else {
    lightNovelReadInfo.value.results.collect = 1;
  }
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

const getLightNovelCommentListApiWrapper = (query: {
  offset: number;
  limit: number;
  replyId?: number;
}) => {
  return getLightNovelCommentListApi({
    lightNovelId: lightNovelInfo.value.results.book.uuid,
    ...query,
  });
};

const commentLightNovelApiWrapper = (query: {
  comment: string;
  replyId?: number;
}) => {
  return commentLightNovelApi({
    lightNovelId: lightNovelInfo.value.results.book.uuid,
    ...query,
  });
};
</script>

<template>
  <div
    v-if="
      loading ||
      lightNovelReadInfoLoading ||
      !lightNovelInfo ||
      !lightNovelReadInfo
    "
    class="wind-flex wind-h-full wind-items-center wind-justify-center"
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
                  :alt="`${lightNovelInfo.results.book.name}的封面`"
                  :src="cover"
                />
              </v-card>
            </div>
            <div
              class="wind-leading-6 wind-flex wind-flex-grow wind-flex-col wind-gap-4"
            >
              <div class="wind-flex wind-flex-wrap wind-gap-2">
                <div class="text-h5">
                  {{ lightNovelInfo.results.book.name }}
                </div>
                <div
                  class="wind-flex wind-flex-wrap wind-gap-2"
                  v-if="lightNovelInfo.results.book.theme.length > 0"
                >
                  <router-link
                    v-for="item of lightNovelInfo.results.book.theme"
                    :key="item.path_word"
                    :to="toLightNovelThemePage(item.path_word, item.name)"
                  >
                    <v-chip color="primary">{{ item.name }}</v-chip>
                  </router-link>
                </div>
              </div>
              <div>
                <v-row no-gutters class="wind-gap-2">
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
                        name: 'LIGHT_NOVEL_READ',
                        params: {
                          lightNovelPathWord,
                          chapterId: lastReadChapter.chapterUuid,
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
                        (lightNovelReadInfo.results.collect ?? 0) > 0
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
          <v-tab value="volume">章节</v-tab>
          <v-tab value="comment">评论</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model:model-value="activeTabKey">
            <v-tabs-window-item value="volume">
              <app-light-novel-chapter
                v-model:last-read-chapter="lastReadChapter"
                :light-novel-path-word="lightNovelPathWord"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="comment">
              <app-comment
                :get-comment-list-api="getLightNovelCommentListApiWrapper"
                :comment-api="commentLightNovelApiWrapper"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
