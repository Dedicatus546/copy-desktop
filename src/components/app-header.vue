<script setup lang="ts">
import { useDisplay } from "vuetify";

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
const { smAndDown } = useDisplay();

onKeyStroke(
  "Escape",
  () => {
    router.back();
  },
  {
    dedupe: true,
  },
);

const logout = () => {
  userStore.logoutAction();
  appStore.updateConfigAction(
    {
      autoLogin: false,
      loginUserInfo: "",
    },
    true,
  );
  router.push({ name: "LOGIN" });
};

const minimizeWin = () => {
  trpcClient.minimizeWin.query();
};

const closeWin = () => {
  trpcClient.closeWin.query();
};

const sectorList = [
  { value: "COMIC", label: "漫画" },
  { value: "LIGHT_NOVEL", label: "小说" },
  { value: "ANIME", label: "动漫" },
];
const currentSector = computed(() =>
  sectorList.find((item) => route.matched.some((r) => r.name === item.value)),
);

const changeSector = (sector: (typeof sectorList)[number]) => {
  router.push({
    name: sector.value,
  });
};
</script>

<template>
  <v-app-bar color="primary" class="app-region-drag">
    <v-app-bar-title>
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
      </div>
    </v-app-bar-title>
    <template #append>
      <div class="app-region-nodrag">
        <v-menu :offset="15">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text">
              {{ currentSector ? `板块：${currentSector.label}` : "切换板块" }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="sector of sectorList"
              :key="sector.value"
              @click="changeSector(sector)"
            >
              <v-list-item-title>{{ sector.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-if="smAndDown">
          <v-menu :offset="15">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" icon="mdi-menu"></v-btn>
            </template>
            <v-list>
              <v-list-item @click="router.back()">
                <template v-slot:prepend>
                  <v-icon icon="mdi-arrow-u-left-top"></v-icon>
                </template>
                <v-list-item-title>返回</v-list-item-title>
              </v-list-item>
              <template v-if="!simple">
                <template v-if="userInfo">
                  <v-list-item
                    @click="
                      router.push({
                        name: 'PERSON',
                      })
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account"></v-icon>
                    </template>
                    <v-list-item-title>个人中心</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-logout"></v-icon>
                    </template>
                    <v-list-item-title>退出</v-list-item-title>
                  </v-list-item>
                </template>
                <v-list-item
                  v-else
                  @click="
                    router.push({
                      name: 'LOGIN',
                    })
                  "
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-login"></v-icon>
                  </template>
                  <v-list-item-title>登录</v-list-item-title>
                </v-list-item>
              </template>
              <v-list-item
                @click="
                  router.push({
                    name: 'CONFIG',
                  })
                "
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-cog"></v-icon>
                </template>
                <v-list-item-title>设置</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  router.push({
                    name: 'DOWNLOAD',
                  })
                "
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-download"></v-icon>
                </template>
                <v-list-item-title>下载</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  router.push({
                    name: 'ABOUT',
                  })
                "
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-information"></v-icon>
                </template>
                <v-list-item-title>关于</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <template v-if="!simple">
            <app-header-icon-btn
              tooltip-text="返回"
              icon="mdi-arrow-u-left-top"
              @click="router.back()"
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
            tooltip-text="下载"
            icon="mdi-download"
            @click="
              router.push({
                name: 'DOWNLOAD',
              })
            "
          />
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
        </template>
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
