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
const theme = useTheme();

onKeyStroke(
  "Escape",
  () => {
    router.back();
  },
  {
    dedupe: true,
  },
);

const changeMode = (mode: "dark" | "light") => {
  appStore.updateConfigAction({ mode });
  //  TODO
  theme.global.name.value = mode;
};

const logout = () => {
  userStore.logoutAction();
  // TODO
  router.replace({ name: "LOGIN" });
};

// TODO
const minimizeWin = () => {
  trpcClient.minimizeWin.query();
  // getCurrentWindow().minimize();
};

const closeWin = () => {
  trpcClient.closeWin.query();
};
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
                  src="@/assets/logo.png"
                  class="wind-w-[50px] wind-block"
                  alt="cm"
                />
                <div class="wind-text-6">拷贝漫画</div>
              </div>
            </div>
          </template>
        </router-link>
        <v-tabs height="40" class="wind-ml-auto">
          <v-tab value="COMIC_HOME">漫画</v-tab>
          <v-tab value="BOOK_HOME">轻小说</v-tab>
          <v-tab value="ANIME_HOME">动漫</v-tab>
        </v-tabs>
        <!-- <div class="wind-flex wind-gap-2">
          <router-link class="wind-text-4" :to="{ name: 'COMIC_HOME' }">
            漫画
          </router-link>
          <router-link class="wind-text-4" :to="{ name: 'COMIC_HOME' }">
            轻小说
          </router-link>
          <router-link class="wind-text-4" :to="{ name: 'COMIC_HOME' }">
            动漫
          </router-link>
        </div> -->
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
            :tooltip-text="`切换${appStore.config.mode === 'dark' ? '日间模式' : '夜间模式'}`"
            icon="mdi-swap-horizontal"
            @click="
              changeMode(appStore.config.mode === 'dark' ? 'light' : 'dark')
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
