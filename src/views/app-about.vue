<script setup lang="ts">
import { trpcClient } from "@/apis/ipc";

import { version } from "../../package.json";

const hash = __COMIT_HASH__;
const isDev = import.meta.env.DEV;

const toRepo = () => {
  trpcClient.openLink.query({
    url: "https://github.com/Dedicatus546/copy-desktop",
  });
};
</script>

<template>
  <v-card title="关于">
    <v-card-text>
      <div
        class="wind-py-4 wind-flex wind-flex-col wind-gap-4 wind-items-center"
      >
        <v-avatar size="100" image="/logo.png" rounded="0" />
        <div class="text-h5">copy-desktop</div>
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
              https://github.com/Dedicatus546/copy-desktop
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
