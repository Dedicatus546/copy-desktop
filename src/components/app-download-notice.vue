<script setup lang="ts">
import useSnackbar from "@/compositions/use-snack-bar";
import { emitter } from "@/mitt";

const snackbar = useSnackbar();

onMounted(() => {
  emitter.on("DownloadSuccess", (item) => {
    let name = "";
    if (item.type === "comic") {
      name = `${item.comicName}-${item.groupName}-${item.chapterName}`;
    }
    snackbar.success(`${name} 下载成功`, {
      timeout: 2000,
    });
  });
});
</script>

<template>
  <div class="wind-hidden wind-absolute"></div>
</template>
