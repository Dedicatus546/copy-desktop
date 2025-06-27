<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { usePagination } from "alova/client";

import { searchLightNovelListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/2.jpg";
import { createComputed } from "@/utils";

const query = useRouteQuery("q");
const searchText = ref("");

const type = createComputed(ref(""), () => {
  data.value = [];
});

const search = () => {
  if (!searchText.value) {
    return;
  }
  query.value = searchText.value;
  data.value = [];
  page.value = 1;
  send(1, 18);
};

const { loading, data, page, send, total } = usePagination(
  (page, pageSize) =>
    searchLightNovelListApi({
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
              <template #prepend>
                <v-select
                  v-model:model-value="type"
                  color="primary"
                  variant="outlined"
                  class="wind-w-[120px]"
                  hide-details
                  item-title="title"
                  item-value="value"
                  :items="[
                    {
                      title: '全部',
                      value: '',
                    },
                    {
                      title: '名称',
                      value: 'name',
                    },
                    {
                      title: '作者',
                      value: 'author',
                    },
                  ]"
                ></v-select>
              </template>
              <template #append-inner>
                <v-btn
                  color="primary"
                  :disabled="!searchText"
                  type="submit"
                  variant="text"
                  icon="mdi-magnify"
                  @click="search"
                ></v-btn>
              </template>
            </v-text-field>
          </v-form>
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
          <v-empty-state
            title="搜索空空如也..."
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
