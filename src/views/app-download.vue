<script setup lang="ts">
import { DownloadItem } from "@electron/module/download";

import { trpcClient } from "@/apis/ipc";
import { useDownloadStore } from "@/stores/use-download-store";

const downloadStore = useDownloadStore();

const openFile = (item: DownloadItem) => {
  trpcClient.showItemInFolder.query({
    path: item.filepath,
  });
};
</script>

<template>
  <v-card>
    <v-tabs v-model:model-value="downloadStore.activeTabKey" bg-color="primary">
      <v-tab value="downloading">正在下载</v-tab>
      <v-tab value="complete">下载完成</v-tab>
    </v-tabs>
    <v-card-text>
      <v-tabs-window v-model:model-value="downloadStore.activeTabKey">
        <v-tabs-window-item value="downloading">
          <v-table>
            <colgroup>
              <col style="width: auto" />
              <col style="width: 100px" />
              <col style="min-width: 300px" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-left">名称</th>
                <th class="text-left">类型</th>
                <th class="text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in downloadStore.downloadingList"
                :key="item.uuid"
              >
                <td>
                  <template v-if="item.type === 'comic'">
                    {{ item.comicName }}-{{ item.groupName }}-{{
                      item.chapterName
                    }}
                  </template>
                  <template v-else-if="item.type === 'light-novel'">
                    {{ item.lightNovelName }}-{{ item.chapterName }}
                  </template>
                </td>
                <td>
                  {{
                    item.type === "comic"
                      ? "漫画"
                      : item.type === "light-novel"
                        ? "轻小说"
                        : "动漫"
                  }}
                </td>
                <td>
                  <template v-if="item.status === 'pending'">
                    等待中...
                  </template>
                  <template v-else>
                    <v-row align="center">
                      <v-col cols="auto"> 正在下载中 </v-col>
                      <v-col>
                        <v-progress-linear
                          color="primary"
                          :model-value="item.percent * 100"
                          size="large"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-tabs-window-item>
        <v-tabs-window-item value="complete">
          <v-table>
            <colgroup>
              <col style="width: auto" />
              <col style="width: 100px" />
              <col style="min-width: 300px" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-left">名称</th>
                <th class="text-left">类型</th>
                <th class="text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in downloadStore.completeList" :key="item.uuid">
                <td>
                  <template v-if="item.type === 'comic'">
                    {{ item.comicName }}-{{ item.groupName }}-{{
                      item.chapterName
                    }}
                  </template>
                  <template v-else-if="item.type === 'light-novel'">
                    {{ item.lightNovelName }}-{{ item.chapterName }}
                  </template>
                </td>
                <td>
                  {{
                    item.type === "comic"
                      ? "漫画"
                      : item.type === "light-novel"
                        ? "轻小说"
                        : "动漫"
                  }}
                </td>
                <td>
                  <v-btn variant="text" color="primary" @click="openFile(item)">
                    打开文件
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
