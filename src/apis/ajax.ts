import http from "./http";

export type RespWrapper<T> = {
  code: number;
  results: T;
  message?: string;
};

export type ListResultWrapper<T> = {
  list: Array<T>;
  total: number;
  limit: number;
  offset: number;
};

export type PaginationQuery = {
  limit: number;
  offset: number;
};

export type Topic = {
  title: string;
  series: null;
  journal: string;
  cover: string;
  period: string;
  type: number;
  brief: string;
  path_word: string;
  datetime_created: string;
};

export type Comic = {
  name: string;
  females: Array<unknown>;
  males: Array<unknown>;
  theme: Array<{
    name: string;
    path_word: string;
  }>;
  path_word: string;
  author: Array<{
    name: string;
    path_word: string;
  }>;
  img_type: number;
  cover: string;
  popular: number;
};

export type RecComic = {
  type: number;
  comic: Comic;
};

export type RankComic = {
  sort: number;
  sort_last: number;
  rise_sort: number;
  rise_num: number;
  date_type: number;
  popular: number;
  comic: Comic;
};

export const getHomeIndexApi = () => {
  return http.Get<
    RespWrapper<{
      topics: ListResultWrapper<Topic>;
      topicsList: ListResultWrapper<Topic>;
      recComics: ListResultWrapper<RecComic>;
      rankDayComics: ListResultWrapper<RankComic>;
      rankWeekComics: ListResultWrapper<RankComic>;
      rankMonthComics: ListResultWrapper<RankComic>;
      hotComics: Array<{
        name: string;
        datetime_created: string;
        comic: Comic;
      }>;
      newComics: Array<{
        name: string;
        datetime_created: string;
        comic: Comic;
      }>;
      finishComics: ListResultWrapper<
        Comic & {
          free_type: {
            display: string;
            value: number;
          };
        }
      >;
      banners: Array<{
        type: number;
        cover: string;
        brief: string;
        out_uuid: string;
        comic: null | Comic;
      }>;
    }>
  >("h5/homeIndex2");
};

export type ComicDetail = {
  uuid: string;
  b_404: boolean;
  b_hidden: boolean;
  ban: number;
  name: string;
  alias: string;
  path_word: string;
  close_comment: boolean;
  close_roast: boolean;
  free_type: {
    display: string;
    value: number;
  };
  restrict: {
    value: number;
    display: string;
  };
  reclass: {
    value: number;
    display: string;
  };
  females: Array<unknown>;
  males: Array<unknown>;
  clubs: Array<unknown>;
  img_type: number;
  seo_baidu: string;
  region: {
    value: number;
    display: string;
  };
  status: {
    value: number;
    display: string;
  };
  author: Array<{
    name: string;
    path_word: string;
  }>;
  theme: Array<{
    name: string;
    path_word: string;
  }>;
  parodies: Array<unknown>;
  brief: string;
  datetime_updated: string;
  cover: string;
  last_chapter: {
    uuid: string;
    name: string;
  };
  popular: number;
};

export const getComicDetailApi = (pathWord: string) => {
  return http.Get<
    RespWrapper<{
      is_banned: boolean;
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
      comic: ComicDetail;
      popular: number;
      groups: Record<
        string,
        {
          path_word: string;
          count: number;
          name: string;
        }
      >;
    }>
  >(`comic2/${pathWord}`);
};

export const getComicReadDetailApi = (query: { comicPathWord: string }) => {
  return http.Get<
    RespWrapper<{
      browse: {
        comic_uuid: string;
        comic_id: string;
        path_word: string;
        chapter_uuid: string;
        chapter_id: string;
        chapter_name: string;
      } | null;
      collect: number;
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
    }>
  >(`comic2/${query.comicPathWord}/query`);
};

export type Series = {
  index: number;
  uuid: string;
  count: number;
  ordered: number;
  size: number;
  name: string;
  comic_id: string;
  comic_path_word: string;
  group_id: string | null;
  group_path_word: string;
  type: number;
  img_type: number;
  news: string;
  datetime_created: string;
  prev: string;
  next: string;
};

export const getComicSeriesListApi = (
  query: {
    comicPathWord: string;
    seriesPathWord: string;
  } & PaginationQuery,
) => {
  return http.Get<RespWrapper<ListResultWrapper<Series>>>(
    `comic/${query.comicPathWord}/group/${query.seriesPathWord}/chapters`,
    {
      params: {
        limit: query.limit,
        offset: query.offset,
      },
    },
  );
};

export type Comment = {
  id: number;
  create_at: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  comment: string;
  count: number;
  parent_id: string | null;
  parent_user_id: string | null;
  parent_user_name: string | null;
};

export const getComicCommentListApi = (
  query: {
    comicId: string;
    replyId?: number;
  } & PaginationQuery,
) => {
  return http.Get<RespWrapper<ListResultWrapper<Comment>>>("comments", {
    params: {
      comic_id: query.comicId,
      reply_id: query.replyId,
      limit: query.limit,
      offset: query.offset,
    },
  });
};

export const commentComicApi = (query: {
  comicId: string;
  comment: string;
  replyId?: number;
}) => {
  const body = new FormData();
  body.set("comic_id", query.comicId);
  body.set("comment", query.comment);
  if (query.replyId) {
    body.set("reply_id", query.replyId + "");
  }
  return http.Post("member/comment", body);
};

export type User = {
  token: string;
  user_id: string;
  username: string;
  nickname: string;
  avatar: string;
  datetime_created: string;
  ticket: number;
  reward_ticket: number;
  ads_vip_end: unknown;
  post_vip_end: unknown;
  downloads: number;
  vip_downloads: number;
  reward_downloads: number;
  invite_code: unknown;
  invited: unknown;
  scy_answer: boolean;
};

export const loginApi = (query: { username: string; password: string }) => {
  const salt = Math.floor(Math.random() * 1000) + "";
  const password = query.password + "-" + salt;
  const body = new FormData();
  body.append("username", query.username);
  body.append("password", btoa(password));
  body.append("salt", salt);
  return http.Post<
    RespWrapper<{
      token: string;
      user_id: string;
      username: string;
      nickname: string;
      avatar: string;
      datetime_created: string;
      ticket: number;
      reward_ticket: number;
      ads_vip_end: unknown;
      post_vip_end: unknown;
      downloads: number;
      vip_downloads: number;
      reward_downloads: number;
      invite_code: unknown;
      invited: unknown;
      scy_answer: boolean;
    }>
  >("login", body);
};

export type SystemNetwork = {
  static: string; // "hi77-overseas.mangafunb.fun";
  image: string; // "";
  share: string; // ["www.mangacopy.com"];
  api: Array<Array<string>>; // [["api.mangacopy.com"], ["api.mangacopy.com"]];
  day_downloads_total: number; // 5;
  ads_reward_downloads: number; // 5;
  ads_screen_show: number; // 4;
  ads_home_seconds: number; // 3600;
  ads_restart_seconds: number; // 60;
  ads_reward_day_show: number; // 3;
  ads_read_express_show: number; // 1;
  day_downloads: number; // 5;
  vip_downloads: number; // ;
  reward_downloads: number; //;
  ads_vip_end: unknown;
  ads_stat_switch: boolean;
  ads_stat_switch2: boolean;
  in_mainland: boolean;
};

export const getSystemNetWorkApi = () => {
  return http.Get<RespWrapper<SystemNetwork>>("system/network2");
};

export const getBookshelfComicListApi = (query: {} & PaginationQuery) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        comic: Comic;
        uuid: number;
        name: unknown;
        b_folder: boolean;
        folder_id: unknown;
        last_browse: {
          last_browse_id: string;
          last_browse_name: string;
        };
      }>
    >
  >("member/collect/comics", {
    params: {
      free_type: 1,
      ordering: "-datetime_modifier",
      limit: query.limit,
      offset: query.offset,
    },
  });
};

export const collectComicApi = (query: {
  comicId: string;
  isCollect: number;
}) => {
  const body = new FormData();
  body.set("comic_id", query.comicId);
  body.set("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/comics", body);
};

export const getBookshelfBookListApi = (query: {} & PaginationQuery) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        comic: Comic;
        uuid: number;
        name: unknown;
        b_folder: boolean;
        folder_id: unknown;
        last_browse: {
          last_browse_id: string;
          last_browse_name: string;
        };
      }>
    >
  >("member/collect/books", {
    params: {
      free_type: 1,
      ordering: "-datetime_modifier",
      limit: query.limit,
      offset: query.offset,
    },
  });
};

export const getComicPicListApi = (query: {
  comicPathWord: string;
  seriesId: string;
}) => {
  return http.Get<
    RespWrapper<{
      show_app: boolean;
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
      comic: Pick<ComicDetail, "name" | "path_word" | "uuid" | "restrict">;
      chapter: Series & {
        contents: Array<{
          url: string;
        }>;
        words: Array<number>; // unknown [0, 1, 2, 3, 4, 5, 6, 11, 8, 14, 7, 12, 9, 10, 13];
        is_long: boolean;
      };
      is_banned: boolean;
    }>
  >(`comic/${query.comicPathWord}/chapter2/${query.seriesId}`);
};

export const getLatestComicListApi = (
  query: {
    limit?: number;
    offset?: number;
  } = {},
) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        name: string;
        datetime_created: string;
        comic: Comic;
      }>
    >
  >(`update/newest`, {
    params: {
      limit: query.limit ?? 10,
      offset: query.offset ?? 0,
    },
  });
};

export const getComicRankListApi = (query: {
  dateType: string;
  limit: number;
  offset: number;
  audienceType: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<RankComic>>>("ranks", {
    params: {
      type: 1,
      date_type: query.dateType,
      limit: query.limit,
      offset: query.offset,
      audience_type: query.audienceType,
    },
  });
};

export const getComicRecommendListApi = (query: {
  limit: number;
  offset: number;
}) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        type: number;
        comic: Comic;
      }>
    >
  >("recs", {
    params: {
      // TODO 不确定该参数为固定还是？
      pos: 3200102,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const getComicCompleteListApi = (query: {
  ordering: string;
  limit: number;
  offset: number;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("comics", {
    params: {
      top: "finish",
      // TODO 未知参数
      free_type: 1,
      ordering: query.ordering,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const searchComicListApi = (query: {
  type: string;
  text: string;
  limit: number;
  offset: number;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("search/comic", {
    params: {
      offset: query.offset,
      limit: query.limit,
      q: query.text,
      q_type: query.type,
    },
  });
};

export const getComicListByThemeApi = (query: {
  limit: number;
  offset: number;
  theme: string;
  ordering: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("comics", {
    params: {
      // TODO 未知参数
      free_type: 1,
      theme: query.theme,
      ordering: query.ordering,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const getComicListByAuthorApi = (query: {
  limit: number;
  offset: number;
  author: string;
  ordering: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("comics", {
    params: {
      // TODO 未知参数
      free_type: 1,
      author: query.author,
      ordering: query.ordering,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const getComicFilterApi = () => {
  return http.Get<
    RespWrapper<{
      theme: Array<{
        initials: number;
        name: string;
        logo: null;
        color_h5: null;
        path_word: string;
        count: number;
      }>;
      ordering: Array<{
        name: string;
        path_word: string;
      }>;
      top: Array<{
        name: string;
        path_word: string;
      }>;
    }>
  >("h5/filter/comic/tags", {
    params: {
      type: 1,
    },
  });
};

// TODO 接口压缩
export const getComicListApi = (
  query: {
    limit?: number;
    offset?: number;
    ordering?: string;
    theme?: string;
    top?: string;
    freeType?: number;
  } = {
    freeType: 1,
    limit: 18,
    offset: 0,
  },
) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("comics", {
    params: {
      // TODO free_type 未知参数
      free_type: query.freeType,
      theme: query.theme,
      top: query.top,
      ordering: query.ordering,
      offset: query.offset,
      limit: query.limit,
    },
  });
};
