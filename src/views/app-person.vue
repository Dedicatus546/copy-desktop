<script setup lang="ts">
import useAppStore from "@/stores/use-app-store";
import useUserStore from "@/stores/use-user-store";

const userStore = useUserStore();
const appStore = useAppStore();
const userInfo = computed(() => userStore.userInfo!);

const activeTabKey = ref<"bookshelf" | "history">("bookshelf");
const tabList = [
  {
    value: "bookshelf",
    tab: "书架",
  },
  {
    value: "history",
    tab: "浏览记录",
  },
];
</script>

<template>
  <v-row v-if="userInfo" :gutter="[16, 16]">
    <v-col :cols="12">
      <v-card>
        <v-card-text>
          <div class="wind-flex wind-flex-col wind-gap-4">
            <div class="wind-flex wind-flex-col wind-items-center">
              <v-avatar
                :size="120"
                :image="`https://${appStore.network!.static}/${userInfo.avatar}`"
              >
              </v-avatar>
              <div class="wind-mt-2 text-h6">{{ userInfo.nickname }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-tabs v-model:model-value="activeTabKey" bg-color="primary">
          <v-tab v-for="item of tabList" :key="item.value" :value="item.value">
            {{ item.tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model:model-value="activeTabKey">
          <v-tabs-window-item value="bookshelf">
            <app-person-bookshelf />
          </v-tabs-window-item>
          <!-- <v-tabs-window-item value="history">
              <app-person-history-comic />
            </v-tabs-window-item> -->
        </v-tabs-window>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
