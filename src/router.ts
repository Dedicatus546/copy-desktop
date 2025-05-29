import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: {
      name: "COMIC",
    },
  },
  {
    path: "/comic",
    name: "COMIC",
    component: () => import("@/views/comic/index.vue"),
    children: [
      {
        path: "home",
        name: "COMIC_HOME",
        component: () => import("@/views/comic/app-comic-home.vue"),
      },
      {
        path: "detail/:comicPathWord",
        name: "COMIC_DETAIL",
        props: true,
        component: () => import("@/views/comic/app-comic-detail.vue"),
      },
      {
        path: "read/:comicPathWord/:seriesId",
        name: "COMIC_READ",
        props: true,
        component: () => import("@/views/comic/app-comic-read.vue"),
      },
      {
        path: "latest",
        name: "COMIC_LATEST",
        component: () => import("@/views/comic/app-comic-latest.vue"),
      },
    ],
  },
  {
    path: "/rank",
    name: "RANK",
    component: () => import("@/views/app-rank.vue"),
  },
  // {
  //   path: "/search",
  //   name: "SEARCH",
  //   component: () => import("@/views/app-search.vue"),
  // },
  // {
  //   path: "/quick-search",
  //   name: "QUICK_SEARCH",
  //   props: (to) => ({
  //     query: to.query.query as string,
  //   }),
  //   component: () => import("@/views/app-quick-search.vue"),
  // },
  // {
  //   path: "/category",
  //   name: "CATEGORY",
  //   component: () => import("@/views/app-category.vue"),
  // },
  // {
  //   path: "/week",
  //   name: "WEEK",
  //   component: () => import("@/views/app-week.vue"),
  // },
  {
    path: "/person",
    name: "PERSON",
    component: () => import("@/views/app-person.vue"),
  },
  {
    path: "/login",
    name: "LOGIN",
    component: () => import("@/views/app-login.vue"),
  },
  {
    path: "/config",
    name: "CONFIG",
    component: () => import("@/views/app-config.vue"),
  },
  {
    path: "/about",
    name: "ABOUT",
    component: () => import("@/views/app-about.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // scrollBehavior,
});

export default router;
