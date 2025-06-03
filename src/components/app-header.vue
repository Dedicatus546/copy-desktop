<script setup lang="ts">
import { useTheme } from "vuetify";

import { trpcClient } from "@/apis/ipc";
import useAppStore from "@/stores/use-app-store";
import useUserStore from "@/stores/use-user-store";

defineProps<{
  simple: boolean;
}>();

const appStore = useAppStore();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const router = useRouter();
const route = useRoute();
const gTheme = useTheme();

onKeyStroke(
  "Escape",
  () => {
    router.back();
  },
  {
    dedupe: true,
  },
);

const changeMode = (theme: "dark" | "light") => {
  appStore.updateConfigAction({ theme });
  gTheme.global.name.value = theme;
};

const logout = () => {
  userStore.logoutAction();
  appStore.updateConfigAction({
    autoLogin: false,
    loginUserInfo: "",
  });
  router.replace({ name: "LOGIN" });
};

const minimizeWin = () => {
  trpcClient.minimizeWin.query();
};

const closeWin = () => {
  trpcClient.closeWin.query();
};

const tabRouteNameList = ["COMIC", "LIGHT_NOVEL", "ANIME"];
const tab = computed({
  get() {
    const r = route.matched.find((item) =>
      tabRouteNameList.includes(item.name as string),
    );
    return r?.name;
  },
  set(routeName) {
    router.push({
      name: routeName,
    });
  },
});
</script>

<template>
  <v-app-bar color="primary" class="app-region-drag">
    <v-app-bar-title>
      <!-- TODO -->
      <div class="wind-flex wind-gap-4 wind-items-center">
        <router-link :to="{ name: 'COMIC_HOME' }" custom>
          <template #default="{ navigate }">
            <div
              class="wind-flex wind-gap-4 wind-h-full wind-items-center"
              @click="navigate"
            >
              <div
                class="wind-flex wind-gap-4 wind-cursor-pointer wind-items-center app-region-nodrag"
              >
                <img
                  src="/logo.png"
                  class="wind-w-[50px] wind-block"
                  alt="cm"
                />
                <div class="wind-text-6">拷贝漫画</div>
              </div>
            </div>
          </template>
        </router-link>
        <div class="wind-ml-auto app-region-nodrag">
          <v-tabs v-model="tab" height="40">
            <v-tab value="COMIC">漫画</v-tab>
            <v-tab value="LIGHT_NOVEL">轻小说</v-tab>
            <v-tab value="ANIME">动漫</v-tab>
          </v-tabs>
        </div>
      </div>
    </v-app-bar-title>
    <template #append>
      <div class="app-region-nodrag">
        <template v-if="!simple">
          <app-header-icon-btn
            tooltip-text="返回"
            icon="mdi-arrow-u-left-top"
            @click="router.back()"
          />
          <app-header-icon-btn
            :tooltip-text="`切换${appStore.config.theme === 'dark' ? '日间模式' : '夜间模式'}`"
            icon="mdi-swap-horizontal"
            @click="
              changeMode(appStore.config.theme === 'dark' ? 'light' : 'dark')
            "
          />
          <template v-if="userInfo">
            <app-header-icon-btn
              tooltip-text="个人中心"
              icon="mdi-account"
              @click="
                router.push({
                  name: 'PERSON',
                })
              "
            />
            <app-header-icon-btn
              tooltip-text="退出"
              icon="mdi-logout"
              @click="logout"
            />
          </template>
          <app-header-icon-btn
            v-else
            tooltip-text="登录"
            icon="mdi-login"
            @click="
              router.push({
                name: 'LOGIN',
              })
            "
          />
        </template>
        <app-header-icon-btn
          tooltip-text="设置"
          icon="mdi-cog"
          @click="
            router.push({
              name: 'CONFIG',
            })
          "
        />
        <app-header-icon-btn
          tooltip-text="关于"
          icon="mdi-information"
          @click="
            router.push({
              name: 'ABOUT',
            })
          "
        />
        <app-header-icon-btn
          tooltip-text="最小化"
          icon="mdi-minus"
          @click="minimizeWin()"
        />
        <app-header-icon-btn
          tooltip-text="关闭"
          icon="mdi-close"
          @click="closeWin()"
        />
      </div>
    </template>
  </v-app-bar>
</template>
