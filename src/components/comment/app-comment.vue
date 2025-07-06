<script setup lang="ts">
import { invalidateCache } from "alova";
import { usePagination, useRequest } from "alova/client";

import {
  commentComicApi,
  commentLightNovelApi,
  getComicCommentListApi,
  getLightNovelCommentListApi,
} from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/1.jpg";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const props = defineProps<{
  getCommentListApi: (query: {
    offset: number;
    limit: number;
    replyId?: number;
  }) =>
    | ReturnType<typeof getComicCommentListApi>
    | ReturnType<typeof getLightNovelCommentListApi>;
  commentApi: (query: {
    comment: string;
    replyId?: number;
  }) =>
    | ReturnType<typeof commentComicApi>
    | ReturnType<typeof commentLightNovelApi>;
}>();

let listMethod:
  | ReturnType<typeof getComicCommentListApi>
  | ReturnType<typeof getLightNovelCommentListApi>
  | undefined = undefined;

const {
  loading,
  page,
  pageCount,
  pageSize,
  data,
  send: refresh,
} = usePagination(
  (page, pageSize) =>
    (listMethod = props.getCommentListApi({
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })),
  {
    initialPage: 1,
    initialPageSize: 10,
    data: (res) => res.results.list,
    total: (res) => res.results.total,
  },
);

const userStore = useUserStore();
const formState = reactive({
  content: "",
});
const {
  loading: commentComicLoading,
  send,
  onSuccess,
} = useRequest(
  () =>
    props.commentApi({
      comment: formState.content,
    }),
  {
    immediate: false,
  },
);
const snackbar = useSnackbar();

onSuccess(() => {
  snackbar.success("评论成功");
  invalidateCache(listMethod);
  refresh(1);
});
</script>

<template>
  <v-form :model="formState" class="wind-mb-4" @submit.prevent="send()">
    <v-row>
      <v-col :cols="12">
        <v-textarea
          v-model:model-value="formState.content"
          size="large"
          placeholder="请理性讨论~"
          hide-details
          :disabled="!userStore.isLogin"
        >
        </v-textarea>
      </v-col>
      <v-col>
        <v-btn
          :disabled="!formState.content || !userStore.isLogin"
          block
          size="large"
          color="primary"
          :loading="commentComicLoading"
          type="submit"
        >
          {{ userStore.isLogin ? "发送" : "登录后才可进行评论" }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-data-iterator :items="data" :items-per-page="pageSize" :loading="loading">
    <template #loader>
      <div
        class="wind-flex wind-h-[30vh] wind-items-center wind-justify-center"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </template>
    <template #no-data>
      <v-empty-state
        title="这看起来是一本没人评价过的漫画"
        :image="EMPTY_STATE_IMG"
      ></v-empty-state>
    </template>
    <template #default="{ items }">
      <v-row>
        <template v-for="item of items" :key="item.raw.id">
          <v-col cols="12">
            <app-comment-list-item
              :getCommentListApi="getCommentListApi"
              :comment-api="commentApi"
              :comment="item.raw"
            />
          </v-col>
          <v-col>
            <v-divider />
          </v-col>
        </template>
      </v-row>
    </template>
    <template #footer>
      <div class="wind-mt-4 wind-flex wind-justify-end">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :disabled="loading"
          :total-visible="8"
        ></v-pagination>
      </div>
    </template>
  </v-data-iterator>
</template>

<style scoped></style>
