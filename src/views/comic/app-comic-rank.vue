<script setup lang="ts">
import { usePagination } from "alova/client";

import { getComicRankListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/2.jpg";

const createComputed = <T,>(r: Ref<T>, fn: () => void) => {
  return computed<T>({
    get() {
      return r.value;
    },
    set(val) {
      r.value = val;
      fn();
    },
  });
};

const audienceType = createComputed(
  ref<string>("male"),
  () => (data.value = []),
);
const dateType = createComputed(ref<string>("day"), () => (data.value = []));

const { loading, data, page, total } = usePagination(
  (page, pageSize) =>
    getComicRankListApi({
      audienceType: audienceType.value,
      dateType: dateType.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    preloadPreviousPage: false,
    append: true,
    initialPage: 1,
    initialPageSize: 18,
    watchingStates: [audienceType, dateType],
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
  <v-card title="排行榜">
    <v-card-text>
      <v-data-iterator
        :items="data"
        :items-per-page="data.length"
        :loading="data.length === 0 && loading"
      >
        <template #header>
          <v-tabs
            v-model:model-value="audienceType"
            align-tabs="center"
            color="primary"
          >
            <v-tab value="male">男频</v-tab>
            <v-tab value="female">女频</v-tab>
          </v-tabs>
          <v-tabs
            v-model:model-value="dateType"
            align-tabs="center"
            color="primary"
          >
            <v-tab value="day">上升最快</v-tab>
            <v-tab value="week">周榜</v-tab>
            <v-tab value="month">月榜</v-tab>
            <v-tab value="total">总榜</v-tab>
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
                <comic-route-item :comic="item.raw.comic" />
              </v-col>
            </template>
          </v-row>
        </template>
        <template #footer>
          <v-btn
            v-if="data.length > 0 && data.length < (total ?? 0)"
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

<style lang="scss" scoped></style>
