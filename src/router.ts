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
    redirect: {
      name: "COMIC_HOME",
    },
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
      {
        path: "recommend",
        name: "COMIC_RECOMMEND",
        component: () => import("@/views/comic/app-comic-recommend.vue"),
      },
      {
        path: "complete",
        name: "COMIC_COMPLETE",
        component: () => import("@/views/comic/app-comic-complete.vue"),
      },
      {
        path: "rank",
        name: "COMIC_RANK",
        component: () => import("@/views/comic/app-comic-rank.vue"),
      },
      {
        path: "search",
        name: "COMIC_SEARCH",
        component: () => import("@/views/comic/app-comic-search.vue"),
      },
      {
        path: "theme/:themePathWord/:themeName",
        name: "COMIC_THEME",
        component: () => import("@/views/comic/app-comic-theme.vue"),
      },
      {
        path: "author/:authorPathWord/:authorName",
        name: "COMIC_AUTHOR",
        component: () => import("@/views/comic/app-comic-author.vue"),
      },
      {
        path: "filter",
        name: "COMIC_FILTER",
        component: () => import("@/views/comic/app-comic-filter.vue"),
      },
    ],
  },
  {
    path: "/light-novel",
    name: "LIGHT_NOVEL",
    redirect: {
      name: "LIGHT_NOVEL_HOME",
    },
    component: () => import("@/views/light-novel/index.vue"),
    children: [
      {
        path: "home",
        name: "LIGHT_NOVEL_HOME",
        component: () => import("@/views/light-novel/app-light-novel-home.vue"),
      },
      {
        path: "detail/:lightNovelPathWord",
        name: "LIGHT_NOVEL_DETAIL",
        props: true,
        component: () =>
          import("@/views/light-novel/app-light-novel-detail.vue"),
      },
      {
        path: "search",
        name: "LIGHT_NOVEL_SEARCH",
        component: () =>
          import("@/views/light-novel/app-light-novel-search.vue"),
      },
      {
        path: "theme/:themePathWord/:themeName",
        name: "LIGHT_NOVEL_THEME",
        component: () =>
          import("@/views/light-novel/app-light-novel-theme.vue"),
      },
      {
        path: "author/:authorPathWord/:authorName",
        name: "LIGHT_NOVEL_AUTHOR",
        component: () =>
          import("@/views/light-novel/app-light-novel-author.vue"),
      },
      {
        path: "read/:lightNovelPathWord/:chapterId",
        name: "LIGHT_NOVEL_READ",
        props: true,
        component: () => import("@/views/light-novel/app-light-novel-read.vue"),
      },
    ],
  },
  {
    path: "/anime",
    name: "ANIME",
    redirect: {
      name: "ANIME_HOME",
    },
    component: () => import("@/views/anime/index.vue"),
    children: [
      {
        path: "home",
        name: "ANIME_HOME",
        component: () => import("@/views/anime/app-anime-home.vue"),
      },
      {
        path: "recommend",
        name: "ANIME_RECOMMEND",
        component: () => import("@/views/anime/app-anime-recommend.vue"),
      },
      {
        path: "detail/:animePathWord",
        name: "ANIME_DETAIL",
        props: true,
        component: () => import("@/views/anime/app-anime-detail.vue"),
      },
      {
        path: "search",
        name: "ANIME_SEARCH",
        component: () => import("@/views/anime/app-anime-search.vue"),
      },
      {
        path: "theme/:themePathWord/:themeName",
        name: "ANIME_THEME",
        component: () => import("@/views/anime/app-anime-theme.vue"),
      },
      {
        path: "company/:companyPathWord/:companyName",
        name: "ANIME_COMPANY",
        component: () => import("@/views/anime/app-anime-company.vue"),
      },
      {
        path: "watch/:animePathWord/:animeChapterUuid/:linePathWord",
        name: "ANIME_WATCH",
        props: true,
        component: () => import("@/views/anime/app-anime-watch.vue"),
      },
    ],
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
