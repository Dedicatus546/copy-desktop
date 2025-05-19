<script setup lang="ts">
import { useRequest } from "alova/client";

import { loginApi } from "@/apis";
import useDecodeUserInfo from "@/compositions/use-decode-user-info";
import useSnackbar from "@/compositions/use-snack-bar";
import useUserStore from "@/stores/use-user-store";

const router = useRouter();
const userStore = useUserStore();

const formState = reactive({
  username: "",
  password: "",
  autoLogin: false,
});

const { encrypt } = useDecodeUserInfo();
const { loading, data, onSuccess, onError, send } = useRequest(
  () =>
    loginApi({
      username: formState.username,
      password: formState.password,
    }),
  {
    immediate: false,
  },
);

const snackbar = useSnackbar();

onSuccess(() => {
  snackbar.primary("登录成功");
  userStore.updateUserInfoAction(data.value.results);
  userStore.updateLoginInfoAction(formState.username, formState.password);
  if (formState.autoLogin) {
    // TODO
    const encryptStr = encrypt({
      username: formState.username,
      password: formState.password,
    });
  }
  router.replace({ name: "PERSON" });
});

onError((e) => {
  snackbar.error((e.error as Error).message);
});
</script>

<template>
  <v-card title="登录到">
    <v-card-text>
      <v-form :disabled="loading" @submit.prevent="send">
        <v-row>
          <v-col :cols="12">
            <v-text-field
              v-model:model-value="formState.username"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[(value) => !!value || '用户名不能为空']"
            ></v-text-field>
          </v-col>
          <v-col :cols="12">
            <v-text-field
              v-model:model-value="formState.password"
              label="密码"
              placeholder="请输入密码"
              type="password"
              :rules="[(value) => !!value || '密码不能为空']"
            ></v-text-field>
          </v-col>
          <v-col :cols="12">
            <v-checkbox
              v-model:model-value="formState.autoLogin"
              density="compact"
              hide-details
              label="自动登录"
            ></v-checkbox>
            <v-alert
              border="start"
              density="compact"
              title="警告"
              type="warning"
            >
              <template #text>
                <div class="wind-flex wind-flex-col wind-gap-2 wind-py-2">
                  <div>1.TODO</div>
                  <div>2.TODO</div>
                </div>
              </template>
            </v-alert>
          </v-col>
          <v-col :cols="12">
            <v-btn
              :loading="loading"
              type="submit"
              size="large"
              block
              color="primary"
            >
              登录
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
