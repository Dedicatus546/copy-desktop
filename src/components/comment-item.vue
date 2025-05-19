<script setup lang="ts">
import { usePagination, useRequest } from "alova/client";

import { Comment, commentComicApi, getComicCommentListApi } from "@/apis";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const props = withDefaults(
  defineProps<{
    comicId: string;
    comment: Comment;
    isReply?: boolean;
  }>(),
  {
    isReply: false,
  },
);

const userStore = useUserStore();
const formState = reactive({
  content: "",
});

const isShowReplyList = ref(false);
const isShowReplyPanel = ref(false);

const {
  loading,
  data,
  page,
  pageCount,
  send: refresh,
} = usePagination(
  (page, pageSize) =>
    getComicCommentListApi({
      comicId: props.comicId,
      replyId: props.comment.id,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    immediate: false,
    initialPage: 1,
    initialPageSize: 5,
    data: (res) => res.results.list,
    total: (res) => res.results.total,
  },
);

const triggerReplyList = () => {
  if (!isShowReplyList.value && data.value.length === 0) {
    refresh(1);
  }
  isShowReplyList.value = !isShowReplyList.value;
};

const {
  loading: commentComicLoading,
  send,
  onSuccess,
} = useRequest(
  () =>
    commentComicApi({
      comicId: props.comicId,
      replyId: props.comment.id,
      comment: formState.content,
    }),
  {
    immediate: false,
  },
);
const snackbar = useSnackbar();

onSuccess(() => {
  snackbar.success("评论成功");
  refresh(1);
});
</script>

<template>
  <div class="wind-flex wind-gap-4 wind-items-start">
    <div class="wind-flex-shrink-0">
      <v-avatar :image="comment.user_avatar" :size="50" />
    </div>
    <div class="wind-flex wind-flex-grow wind-flex-col wind-gap-2">
      <div class="wind-flex wind-flex-col">
        <div class="wind-text-base">
          <span :data-user-id="comment.user_id">{{ comment.user_name }}</span>
          <template v-if="isReply">
            <span class="wind-text-gray-500 wind-px-2 wind-inline-block">
              回复
            </span>
            <span :data-user-id="comment.parent_id">
              {{ comment.parent_user_name }}
            </span>
          </template>
        </div>
        <div class="wind-text-sm wind-text-gray-400">
          {{ comment.create_at }}
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="comment.comment"></div>
      <!-- TODO 回复设计 -->
      <v-row no-gutters class="wind-gap-2">
        <v-col v-if="!isReply && comment.count > 0" cols="auto">
          <v-btn
            variant="tonal"
            size="small"
            :loading="loading"
            @click="triggerReplyList"
          >
            {{ isShowReplyList ? "收起评论" : "查看评论" }}
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            variant="tonal"
            size="small"
            @click="isShowReplyPanel = !isShowReplyPanel"
          >
            回复
          </v-btn>
        </v-col>
        <v-col v-if="isShowReplyPanel" :cols="12" class="wind-mt-2">
          <v-form :model="formState" @submit.prevent="send()">
            <v-row no-gutters class="wind-gap-2">
              <v-col :cols="12">
                <v-textarea
                  v-model:model-value="formState.content"
                  :rows="2"
                  size="small"
                  :placeholder="`回复${comment.user_name}`"
                  hide-details
                  :disabled="!userStore.isLogin"
                >
                </v-textarea>
              </v-col>
              <v-col>
                <v-btn
                  :disabled="!formState.content || !userStore.isLogin"
                  block
                  color="primary"
                  :loading="commentComicLoading"
                  type="submit"
                >
                  {{ userStore.isLogin ? "回复" : "登录后才可进行评论" }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <div v-if="isShowReplyList && comment.count > 0">
        <v-row>
          <template v-for="subItem of data" :key="subItem.id">
            <v-col :cols="12">
              <v-divider />
            </v-col>
            <v-col :cols="12">
              <comment-item is-reply :comic-id="comicId" :comment="subItem" />
            </v-col>
          </template>
          <v-col :cols="12">
            <div class="wind-flex wind-justify-end">
              <v-pagination
                v-model="page"
                size="small"
                :length="pageCount"
                :disabled="loading"
                :total-visible="8"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
