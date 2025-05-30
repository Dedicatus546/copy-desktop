<script setup lang="ts">
import { usePagination } from "alova/client";

import { getComicCompleteListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/4.jpg";

const _ordering = ref<string>("datetime_updated");
const ordering = computed({
  get() {
    return _ordering.value;
  },
  set(val) {
    _ordering.value = val;
    data.value = [];
  },
});

const { loading, data, page } = usePagination(
  (page, pageSize) =>
    getComicCompleteListApi({
      ordering: ordering.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    preloadPreviousPage: false,
    append: true,
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
  <v-card title="已完结">
    <v-card-text>
      <v-data-iterator
        :items="data"
        :items-per-page="data.length"
        :loading="loading"
      >
        <template #header>
          <v-tabs
            v-model:model-value="ordering"
            align-tabs="center"
            color="primary"
          >
            <v-tab value="datetime_updated">
              更新时间
              <v-icon icon="mdi-chevron-up"></v-icon>
            </v-tab>
            <v-tab value="-datetime_updated">
              更新时间
              <v-icon icon="mdi-chevron-down"></v-icon>
            </v-tab>
            <v-tab value="popular">
              热度
              <v-icon icon="mdi-chevron-up"></v-icon>
            </v-tab>
            <v-tab value="-popular">
              热度
              <v-icon icon="mdi-chevron-down"></v-icon>
            </v-tab>
          </v-tabs>
          <div class="wind-h-8"></div>
        </template>
        <template #loader>
          <div
            class="wind-flex wind-h-[30vh] wind-items-center wind-justify-center"
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </template>
        <template #no-data>
          <app-empty-state
            title="出现这个就大概率是出 BUG 了，请提 issue"
            :image="EMPTY_STATE_IMG"
          ></app-empty-state>
        </template>
        <template #default="{ items }">
          <v-row>
            <template v-for="item of items" :key="item.raw.id">
              <v-col cols="6" :sm="4" :md="3" :lg="2">
                <comic-route-item :comic="item.raw" />
              </v-col>
            </template>
          </v-row>
        </template>
        <template #footer>
          <v-btn
            v-if="data.length > 0"
            :loading="loading"
            block
            color="primary"
            class="mt-4"
            size="large"
            @click="page++"
          >
            查看更多
          </v-btn>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>
