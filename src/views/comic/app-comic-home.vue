<script setup lang="ts">
import { breakpointsVuetifyV3 } from "@vueuse/core";
import { useRequest } from "alova/client";

import { getHomeIndexApi } from "@/apis";

const { loading, data } = useRequest(() => getHomeIndexApi());

const breakpoints = useBreakpoints(breakpointsVuetifyV3);
const isGreaterXXL = breakpoints.greater("xxl");
const isGreaterXL = breakpoints.greater("xl");
const isGreaterSM = breakpoints.greater("sm");
const slidesPerView = computed(() => {
  if (isGreaterXXL.value) {
    return 6.3;
  } else if (isGreaterXL.value) {
    return 5.3;
  } else if (isGreaterSM.value) {
    return 4.3;
  }
  return 3.3;
});
const minListCount = computed(() => {
  if (isGreaterXXL.value) {
    return 7;
  } else if (isGreaterXL.value) {
    return 6;
  } else if (isGreaterSM.value) {
    return 5;
  }
  return 4;
});

const rankTab = ref<"rankDayComics" | "rankWeekComics" | "rankMonthComics">(
  "rankDayComics",
);
const rankTabList = [
  { label: "上升最快", value: "rankDayComics" },
  { label: "周榜", value: "rankWeekComics" },
  { label: "月榜", value: "rankMonthComics" },
] as const;
</script>

<template>
  <div
    v-if="loading"
    class="wind-flex wind-items-center wind-inset-0 wind-justify-center wind-absolute"
  >
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <v-row v-else>
    <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="wind-flex wind-items-center wind-justify-between">
            <v-card-title>漫画推荐</v-card-title>
            <router-link custom :to="{ name: 'COMIC_RECOMMEND' }">
              <template #default="{ navigate }">
                <v-btn variant="text" @click="navigate()">更多</v-btn>
              </template>
            </router-link>
          </div>
        </v-card-item>
        <v-card-text>
          <v-row>
            <v-col
              v-for="item of data.results.recComics.list"
              :key="item.comic.path_word"
              :cols="6"
              :sm="4"
              :md="3"
              :lg="2"
            >
              <comic-route-item :comic="item.comic" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="wind-flex wind-items-center wind-justify-between">
            <v-card-title>热门漫画</v-card-title>
          </div>
        </v-card-item>
        <v-card-text>
          <v-row v-if="data.results.hotComics.length < minListCount">
            <v-col
              v-for="item of data.results.hotComics"
              :key="item.comic.path_word"
              :cols="6"
              :sm="4"
              :md="3"
              :lg="2"
            >
              <comic-route-item :comic="item.comic" />
            </v-col>
          </v-row>
          <app-home-swiper
            v-else
            :list="data.results.hotComics.map((item) => item.comic)"
            :slides-per-view="slidesPerView"
          ></app-home-swiper>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="wind-flex wind-items-center wind-justify-between">
            <v-card-title>全新上架</v-card-title>
            <router-link
              custom
              :to="{
                name: 'COMIC_LATEST',
              }"
            >
              <template #default="{ navigate }">
                <v-btn variant="text" @click="navigate()">更多</v-btn>
              </template>
            </router-link>
          </div>
        </v-card-item>
        <v-card-text>
          <v-row v-if="data.results.newComics.length < minListCount">
            <v-col
              v-for="item of data.results.newComics"
              :key="item.comic.path_word"
              :cols="6"
              :sm="4"
              :md="3"
              :lg="2"
            >
              <comic-route-item :comic="item.comic" />
            </v-col>
          </v-row>
          <app-home-swiper
            v-else
            :list="data.results.newComics.map((item) => item.comic)"
            :slides-per-view="slidesPerView"
          ></app-home-swiper>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="wind-flex wind-items-center wind-justify-between">
            <v-card-title>已完结</v-card-title>
            <router-link
              custom
              :to="{
                name: 'COMIC_COMPLETE',
              }"
            >
              <template #default="{ navigate }">
                <v-btn variant="text" @click="navigate()">更多</v-btn>
              </template>
            </router-link>
          </div>
        </v-card-item>
        <v-card-text>
          <v-row v-if="data.results.finishComics.list.length < minListCount">
            <v-col
              v-for="item of data.results.finishComics.list"
              :key="item.path_word"
              :cols="6"
              :sm="4"
              :md="3"
              :lg="2"
            >
              <comic-route-item :comic="item" />
            </v-col>
          </v-row>
          <app-home-swiper
            v-else
            :list="data.results.finishComics.list"
            :slides-per-view="slidesPerView"
          ></app-home-swiper>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="wind-flex wind-items-center wind-justify-between">
            <v-card-title>排行榜（男频）</v-card-title>
            <router-link custom :to="{ name: 'RANK' }">
              <template #default="{ navigate }">
                <v-btn variant="text" @click="navigate()">全部排行</v-btn>
              </template>
            </router-link>
          </div>
        </v-card-item>
        <v-tabs v-model:model-value="rankTab" bg-color="transparent" grow>
          <v-tab
            v-for="item in rankTabList"
            :key="item.value"
            :text="item.label"
            :value="item.value"
          ></v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model:model-value="rankTab">
            <v-tabs-window-item
              v-for="item in rankTabList"
              :key="item.value"
              :value="item.value"
            >
              <v-card flat>
                <v-row>
                  <v-col
                    v-for="subItem of data.results[item.value].list"
                    :key="subItem.comic.path_word"
                    :cols="6"
                    :sm="4"
                    :md="3"
                    :lg="2"
                  >
                    <comic-route-item :comic="subItem.comic" />
                  </v-col>
                </v-row>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- <v-col :cols="12">
      <v-card>
        <v-card-item>
          <div class="flex items-center justify-between">
            <v-card-title>最新发布</v-card-title>
            <router-link custom :to="{ name: 'COMIC_LATEST' }">
              <template #default="{ navigate }">
                <v-btn variant="text" @click="navigate()">更多</v-btn>
              </template>
            </router-link>
          </div>
        </v-card-item>
        <v-card-text>
          <v-row>
            <v-col
              v-for="item of latestData.data"
              :key="item.id"
              :cols="6"
              :sm="4"
              :md="3"
              :lg="2"
            >
              <comic-route-item :comic="item" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col> -->
  </v-row>
</template>
