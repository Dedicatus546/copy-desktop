<script setup lang="ts">
const activeTabKey = ref<"downloading" | "complete">("downloading");
const desserts = [
  {
    name: "租界女友",
    type: 1,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
  },
];
</script>

<template>
  <v-card>
    <v-tabs v-model:model-value="activeTabKey" bg-color="primary">
      <v-tab value="downloading">正在下载</v-tab>
      <v-tab value="complete">正在下载</v-tab>
    </v-tabs>
    <v-card-text>
      <v-tabs-window v-model:model-value="activeTabKey">
        <v-tabs-window-item value="downloading">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">名称</th>
                <th class="text-left">类型</th>
                <th class="text-left">进度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in desserts" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-tabs-window-item>
        <v-tabs-window-item value="complete"></v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
