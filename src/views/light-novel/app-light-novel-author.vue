<script setup lang="ts">
import { useRouteParams, useRouteQuery } from "@vueuse/router";
import { usePagination } from "alova/client";

import { getLightNovelListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/5.jpg";

const authorName = useRouteParams("authorName") as Ref<string>;
const authorPathWord = useRouteParams("authorPathWord") as Ref<string>;
const ordering = useRouteQuery<string>("ordering", "-datetime_updated", {
  mode: "push",
});

const { loading, data, page, pageCount } = usePagination(
  (page, pageSize) =>
    getLightNovelListApi({
      author: authorPathWord.value,
      ordering: ordering.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    initialPage: 1,
    initialPageSize: 18,
    watchingStates: [ordering],
    data: (res) => res.results.list,
    total: (res) => res.results.total,
    initialData: {
      results: {
        list: [],
        total: 0,
      },
    },
  },
);
</script>

<template>
  <v-card :title="authorName">
    <v-card-text>
      <v-data-iterator
        :items="data"
        :items-per-page="data.length"
        :loading="page === 1 && loading"
      >
        <template #header>
          <v-chip-group
            filter
            column
            color="primary"
            v-model:model-value="ordering"
          >
            <v-chip value="-datetime_updated">
              更新时间
              <v-icon icon="mdi-chevron-down"></v-icon>
            </v-chip>
            <v-chip value="datetime_updated">
              更新时间
              <v-icon icon="mdi-chevron-up"></v-icon>
            </v-chip>
            <v-chip value="-popular">
              热度
              <v-icon icon="mdi-chevron-down"></v-icon>
            </v-chip>
            <v-chip value="popular">
              热度
              <v-icon icon="mdi-chevron-up"></v-icon>
            </v-chip>
          </v-chip-group>
          <div class="wind-h-4"></div>
        </template>
        <template #loader>
          <div
            class="wind-flex wind-h-[30vh] wind-items-center wind-justify-center"
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </template>
        <template #no-data>
          <v-empty-state
            title="出现这个就大概率是出 BUG 了，请提 issue"
            :image="EMPTY_STATE_IMG"
          ></v-empty-state>
        </template>
        <template #default="{ items }">
          <v-row>
            <template v-for="item of items" :key="item.raw.id">
              <v-col cols="6" :sm="4" :md="3" :lg="2">
                <app-light-novel-list-item :light-novel="item.raw" />
              </v-col>
            </template>
          </v-row>
        </template>
        <template #footer>
          <div class="wind-mt-4 wind-flex wind-justify-end">
            <v-pagination
              color="primary"
              v-model="page"
              :length="pageCount"
              :disabled="loading"
              :total-visible="8"
            ></v-pagination>
          </div>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>
