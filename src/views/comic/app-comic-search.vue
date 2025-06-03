<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { usePagination } from "alova/client";

import { searchComicListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/2.jpg";

const query = useRouteQuery("q");
const searchText = ref("");

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

const type = createComputed(ref(""), () => {
  data.value = [];
});

const search = () => {
  data.value = [];
  page.value = 1;
  send(1, 18);
};

const { loading, data, page, send, total } = usePagination(
  (page, pageSize) =>
    searchComicListApi({
      text: searchText.value,
      type: type.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    immediate: false,
    preloadPreviousPage: false,
    preloadNextPage: false,
    append: true,
    initialPage: 1,
    initialPageSize: 18,
    watchingStates: [type],
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

onMounted(() => {
  if (query.value) {
    searchText.value = query.value as string;
    query.value = null;
    search();
  }
});
</script>

<template>
  <v-card title="搜索">
    <v-card-text>
      <v-data-iterator
        :items="data"
        :items-per-page="data.length"
        :loading="data.length === 0 && loading"
      >
        <template #header>
          <v-form @submit.prevent="search">
            <v-text-field
              v-model:model-value="searchText"
              color="primary"
              variant="outlined"
              placeholder="搜索"
              hide-details
            >
              <template #append-inner>
                <v-btn
                  variant="text"
                  icon="mdi-magnify"
                  @click="search"
                ></v-btn>
              </template>
            </v-text-field>
          </v-form>
          <div class="wind-h-8"></div>
          <v-tabs
            v-model:model-value="type"
            align-tabs="center"
            color="primary"
          >
            <v-tab value="">全部</v-tab>
            <v-tab value="name">名称</v-tab>
            <v-tab value="author">作者</v-tab>
            <v-tab value="local">汉化组</v-tab>
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
            title="搜索空空如也..."
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

<style scoped lang="scss"></style>
