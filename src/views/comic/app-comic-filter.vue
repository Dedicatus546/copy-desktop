<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { usePagination, useRequest } from "alova/client";

import { getComicFilterApi, getComicListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/2.jpg";

const theme = useRouteQuery<string>("theme", "", {
  mode: "push",
});
const ordering = useRouteQuery<string>("ordering", "", {
  mode: "push",
});
const top = useRouteQuery<string>("top", "", {
  mode: "push",
});

const { loading: filterLoading, data: filterData } = useRequest(
  () => getComicFilterApi(),
  {
    initialData: {
      results: {
        theme: [],
        top: [],
        ordering: [],
      },
    },
  },
);

const { loading, data, page, total } = usePagination(
  (page, pageSize) =>
    getComicListApi({
      theme: theme.value,
      ordering: ordering.value,
      top: top.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    append: true,
    initialPage: 1,
    initialPageSize: 18,
    watchingStates: [theme, ordering, top],
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
  <v-card title="发现">
    <v-card-text>
      <v-data-iterator
        :items="data"
        :items-per-page="data.length"
        :loading="page === 1 && (filterLoading || loading)"
      >
        <template #header>
          <template v-if="!filterLoading">
            <v-chip-group
              color="primary"
              v-model:model-value="theme"
              filter
              column
            >
              <v-chip
                v-for="item of filterData.results.theme"
                :key="item.path_word"
                :value="item.path_word"
              >
                {{ item.name }}
              </v-chip>
            </v-chip-group>
            <v-divider />
            <v-chip-group
              color="primary"
              v-model:model-value="top"
              filter
              column
            >
              <v-chip
                v-for="item of filterData.results.top"
                :key="item.path_word"
                :value="item.path_word"
              >
                {{ item.name }}
              </v-chip>
            </v-chip-group>
            <v-divider />
            <v-chip-group
              color="primary"
              v-model:model-value="ordering"
              filter
              column
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
          </template>
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
            title="搜索空空如也..."
            :image="EMPTY_STATE_IMG"
          ></v-empty-state>
        </template>
        <template #default="{ items }">
          <v-row>
            <template v-for="item of items" :key="item.raw.id">
              <v-col cols="6" :sm="4" :md="3" :lg="2">
                <app-comic-list-item :comic="item.raw" />
              </v-col>
            </template>
          </v-row>
        </template>
        <template #footer>
          <v-btn
            v-if="
              !(page === 1 && (filterLoading || loading)) &&
              data.length < (total ?? 0)
            "
            :loading="loading"
            block
            color="primary"
            class="wind-mt-4"
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
