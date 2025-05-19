<script setup lang="ts">
const loading = ref(false);
const saveLoading = ref(false);

const formValid = ref<boolean | null>(null);

interface State {
  api: string;
  readMode: number;
  zoomFactor: number;
}

const formState = reactive<State>({
  api: "",
  readMode: 1,
  zoomFactor: 1,
});

const getConfig = async () => {
  // TODO
  try {
    // const res = await invoke<State>("get_config");
    // Object.assign(formState, res);
  } catch (e) {
    console.error("读取配置文件失败", e);
  }
};

const submit = async () => {
  if (!formValid.value) {
    return;
  }
  try {
    // TODO
    // await invoke<void>("save_config", {
    //   configStr: JSON.stringify(formState),
    // });
  } catch (e) {
    console.error("保存配置失败", e);
  }
};

onMounted(() => {
  getConfig();
});
</script>

<template>
  <v-card title="软件设置">
    <v-card-text>
      <v-form v-model:model-value="formValid" @submit.prevent="submit">
        <div v-if="loading" class="flex h-[30vh] items-center justify-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-row>
          <v-col :cols="12">
            <v-select
              v-model:model-value="formState.readMode"
              label="阅读模式"
              item-title="text"
              item-value="value"
              :items="[
                {
                  value: 1,
                  text: '竖向滚动',
                },
                {
                  value: 2,
                  text: '按钮切换',
                },
              ]"
            ></v-select>
          </v-col>
          <v-col :cols="12">
            <v-slider
              v-model:model-value="formState.zoomFactor"
              thumb-label="always"
              :min="1"
              :max="3"
              :step="0.2"
              label="缩放等级"
            ></v-slider>
          </v-col>
          <v-col :cols="12">
            <v-btn
              size="large"
              block
              color="primary"
              type="submit"
              :loading="saveLoading"
            >
              保存
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
