<script setup lang="ts">
import LOGO from "@/assets/logo.png";

import { version } from "../../package.json";

const hash = __COMIT_HASH__;
const isDev = import.meta.env.DEV;

const toRepo = () => {
  // TODO 关于页面
  // openLinkIpc("https://github.com/Dedicatus546/cm-desktop");
};
</script>

<template>
  <v-card title="关于">
    <v-card-text>
      <div
        class="wind-flex wind-flex-col wind-gap-4 wind-items-center wind-py-4"
      >
        <v-avatar size="100" :image="LOGO" rounded="0" />
        <div class="text-h5">cm-desktop</div>
      </div>
      <v-divider />
      <v-list>
        <v-list-item title="版本">
          <template #append>
            {{ version }}
          </template>
        </v-list-item>
        <v-list-item title="commit">
          <template #append>
            {{ isDev ? "DEV" : hash }}
          </template>
        </v-list-item>
        <v-list-item title="仓库地址">
          <template #append>
            <div class="wind-cursor-pointer" @click="toRepo">
              https://github.com/Dedicatus546/cm-desktop
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
