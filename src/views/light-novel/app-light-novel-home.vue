<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { usePagination, useRequest } from "alova/client";

import { getLightNovelListApi, getLightNovelThemeListApi } from "@/apis";
import EMPTY_STATE_IMG from "@/assets/empty-state/2.jpg";

const router = useRouter();
const searchText = ref("");

const search = () => {
  router.push({
    name: "LIGHT_NOVEL_SEARCH",
    query: {
      q: searchText.value,
    },
  });
};

const theme = useRouteQuery("theme", "", {
  mode: "push",
});
const ordering = useRouteQuery("ordering", "", {
  mode: "push",
});

const { loading: themeFilterLoading, data: themeFilterData } = useRequest(
  () => getLightNovelThemeListApi(),
  {
    initialData: {
      results: {
        list: [],
      },
    },
  },
);

const { loading, data, page, total } = usePagination(
  (page, pageSize) =>
    getLightNovelListApi({
      theme: theme.value,
      ordering: ordering.value,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  {
    preloadPreviousPage: false,
    preloadNextPage: false,
    append: true,
    initialPage: 1,
    initialPageSize: 18,
    watchingStates: [theme, ordering],
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
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="search">
            <v-text-field
              color="primary"
              v-model:model-value="searchText"
              variant="outlined"
              placeholder="输入轻小说名称进行搜索"
              hide-details
            >
              <template #append-inner>
                <v-btn
                  :disabled="!searchText"
                  color="primary"
                  type="submit"
                  variant="text"
                  icon="mdi-magnify"
                  @click="search"
                ></v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-text>
          <v-data-iterator
            :items="data"
            :items-per-page="data.length"
            :loading="page === 1 && (themeFilterLoading || loading)"
          >
            <template #header>
              <template v-if="!themeFilterLoading">
                <v-chip-group
                  color="primary"
                  v-model:model-value="theme"
                  filter
                  column
                >
                  <v-chip
                    v-for="item of themeFilterData.results.list"
                    :disabled="item.count === 0"
                    :key="item.path_word"
                    :value="item.path_word"
                  >
                    {{ item.name }}
                    {{ item.count }}
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
                    <app-light-novel-list-item :light-novel="item.raw" />
                  </v-col>
                </template>
              </v-row>
            </template>
            <template #footer>
              <v-btn
                v-if="
                  !(page === 1 && (themeFilterLoading || loading)) &&
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
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
