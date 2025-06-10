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

export type LightNovel = {
  path_word: string; // "shenyudeshishenzhemen";
  name: string; // "神域的弒神者們";
  cover: string; //"https://hi77-overseas.mangafuna.xyz/book/shenyudeshishenzhemen/cover/1670686728.jpg.328x422.jpg";
  author: Array<{
    name: string;
    path_word: string;
  }>;
  status: number;
  popular: number;
  datetime_updated: string;
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
      collect: number | null;
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
  return http.Post<RespWrapper<void>>("member/comment", body);
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

export const getCollectComicListApi = (query: {} & PaginationQuery) => {
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

export const getCollectLightNovelListApi = (query: {} & PaginationQuery) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        book: LightNovel;
        uuid: number;
        last_browse: {
          last_browse_id: string;
          last_browse_name: string;
        } | null;
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

export const getComicListApi = (query: {
  limit?: number;
  offset?: number;
  ordering?: string;
  theme?: string;
  top?: string;
  freeType?: number;
  author?: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Comic>>>("comics", {
    params: {
      // TODO free_type 未知参数
      free_type: query.freeType ?? 1,
      author: query.author,
      theme: query.theme,
      top: query.top,
      ordering: query.ordering,
      offset: query.offset ?? 0,
      limit: query.limit ?? 18,
    },
  });
};

export const getLightNovelFilterApi = () => {
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
  >("h5/filter/book/tags");
};

export const getLightNovelThemeListApi = () => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        initials: number;
        name: string;
        logo: null;
        color_h5: null;
        path_word: string;
        count: number;
      }>
    >
  >("theme/book/count", {
    params: {
      limit: 500,
      offset: 0,
      free_type: 1,
    },
  });
};

export const getLightNovelListApi = (query: {
  limit?: number;
  offset?: number;
  ordering?: string;
  theme?: string;
  freeType?: number;
  author?: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<LightNovel>>>("books", {
    params: {
      author: query.author,
      theme: query.theme,
      ordering: query.ordering,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const searchLightNovelListApi = (query: {
  type: string;
  text: string;
  limit: number;
  offset: number;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<LightNovel>>>("search/books", {
    params: {
      offset: query.offset,
      limit: query.limit,
      q: query.text,
      q_type: query.type,
    },
  });
};

export type LightNovelDetail = {
  uuid: string; // "e3655f4e-e30c-11ef-afcc-3f487b7d9a9a";
  name: string; // "能夠率直說出喜歡的女生無雙";
  path_word: string; //"nenggoushuaizhishuochuxihuandenvshengwushuang";
  close_comment: boolean; // false;
  close_roast: boolean; // false;
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
  brief: string; //"戀愛喜劇的必勝方法只有一個——那就是不停地傳達『喜歡』。\r\n對男高中生·和泉抱持戀心的女生們始終無法踏出那一步，日復一日地生活着。\r\n【校園偶像，只會在兩個人單獨相處的時候撒嬌】天琦雨音。\r\n【明明都被老家斷絕關係了，但是前未婚妻卻不肯放手】白菊白亞。\r\n【校園的小天使……身邊的小惡魔，意外地好搞定】春日波留。\r\n不過，轉到這所學校的是咋看之下很平凡，但生來就是主要女主角的·七緒七瀨。\r\n七緒用刁鑽的直球攻擊朝和泉發起猛攻。\r\n「和泉同學，我喜歡你。請和我交往」「來，啊～♪」「是和泉同學，把我變成這種女生的喔？」\r\n「「「這傢伙……竟然出手了！？」」」驚慌不已的雨音她們也開始展開行動————！？";
  datetime_updated: string; //"2025-06-06";
  cover: string; // "https://hi77-overseas.mangafuna.xyz/book/nenggoushuaizhishuochuxihuandenvshengwushuang/cover/1738682996.jpg.328x422.jpg";
  last_chapter: {
    id: string;
    name: string;
  };
  popular: number;
};

export const getLightNovelDetailApi = (lightNovelPathWord: string) => {
  return http.Get<
    RespWrapper<{
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
      book: LightNovelDetail;
      popular: number;
    }>
  >(`book/${lightNovelPathWord}`);
};

export const getLightNovelReadDetailApi = (query: {
  lightNovelPathWord: string;
}) => {
  return http.Get<
    RespWrapper<{
      browse: {
        book_id: string; // "e3655f4e-e30c-11ef-afcc-3f487b7d9a9a",
        path_word: string; //"nenggoushuaizhishuochuxihuandenvshengwushuang",
        chapter_id: string; //"14448",
        chapter_name: string; //"第2卷"
      } | null;
      collect: number | null;
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
    }>
  >(`book/${query.lightNovelPathWord}/query`);
};

export const collectLightNovelApi = (query: {
  lightNovelId: string;
  isCollect: number;
}) => {
  const body = new FormData();
  body.set("book_id", query.lightNovelId);
  body.set("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/book", body);
};

export const getLightNovelVolumeListApi = (query: {
  lightNovelPathWord: string;
}) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        index: number;
        id: string;
        count: number; // 2;
        sort: number; // 10;
        name: string; // "第1卷";
        book_id: string; // "e3655f4e-e30c-11ef-afcc-3f487b7d9a9a";
        book_path_word: string; // "nenggoushuaizhishuochuxihuandenvshengwushuang";
        prev: string | null;
        next: string | null; // "14448";
      }>
    >
  >(`book/${query.lightNovelPathWord}/volumes`);
};

export const getLightNovelCommentListApi = (
  query: {
    lightNovelId: string;
    replyId?: number;
  } & PaginationQuery,
) => {
  return http.Get<RespWrapper<ListResultWrapper<Comment>>>("bookcomments", {
    params: {
      book_id: query.lightNovelId,
      reply_id: query.replyId,
      limit: query.limit,
      offset: query.offset,
    },
  });
};

export const commentLightNovelApi = (query: {
  lightNovelId: string;
  comment: string;
  replyId?: number;
}) => {
  const body = new FormData();
  body.set("book_id", query.lightNovelId);
  body.set("comment", query.comment);
  if (query.replyId) {
    body.set("reply_id", query.replyId + "");
  }
  return http.Post<RespWrapper<void>>("member/comment", body);
};

export const getAnimeIndexApi = () => {
  return http.Get<
    RespWrapper<{
      topics: ListResultWrapper<{
        title: string;
        series: unknown | null;
        journal: string;
        cover: string;
        period: unknown | null;
        type: number;
        brief: string;
        path_word: string;
        datetime_created: string;
      }>;
      recCartoons: ListResultWrapper<{
        type: number;
        comic: {
          path_word: string;
          name: string;
          cover: string;
          theme: Array<{
            name: string;
            path_word: string;
          }>;
          females: Array<unknown>;
          males: Array<unknown>;
          company: {
            name: string;
            path_word: string;
          };
          years: string;
          count: number;
          popular: number;
        };
      }>;
      tags: Array<{
        initials: number;
        name: string;
        logo: unknown | null;
        color_h5: unknown | null;
        path_word: string;
        count: number;
      }>;
      ordering: Array<{
        name: string;
        path_word: string;
      }>;
      banners: Array<{
        type: number;
        cover: string;
        brief: string;
        out_uuid: string;
        comic: {
          name: string;
          path_word: string;
        };
      }>;
    }>
  >("h5/cartoonIndex");
};

export type Anime = {
  path_word: string; // "gorillanokamikarakagosaretareijouwaouritsukishidandekawaigarareru";
  name: string; // "受到猩猩之神庇護的大小姐在皇家騎士團受到寵愛";
  cover: string; //"https://sg.mangafuna.xyz/g/gorillanokamikarakagosaretareijouwaouritsukishidandekawaigarareru/cover/1742753144.jpg.328x422.jpg";
  count: number;
  years: string;
  theme: Array<{
    name: string;
    path_word: string;
  }>;
  females: Array<unknown>;
  males: Array<unknown>;
  datetime_updated: string;
  b_subtitle: boolean;
  popular: number;
};

export const getAnimeListApi = (query: {
  limit?: number;
  offset?: number;
  ordering?: string;
  theme?: string;
  freeType?: number;
  company?: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Anime>>>("cartoons", {
    params: {
      free_type: query.freeType ?? 1,
      theme: query.theme,
      ordering: query.ordering,
      offset: query.offset ?? 0,
      limit: query.limit ?? 18,
      company: query.company,
    },
  });
};

export const searchAnimeListApi = (query: {
  text: string;
  limit: number;
  offset: number;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<Anime>>>("search/cartoons", {
    params: {
      offset: query.offset,
      limit: query.limit,
      q: query.text,
    },
  });
};

export const getAnimeThemeListApi = () => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        initials: number;
        name: string;
        logo: null;
        color_h5: null;
        path_word: string;
        count: number;
      }>
    >
  >("theme/cartoon/count", {
    params: {
      limit: 500,
      offset: 0,
      free_type: 1,
    },
  });
};

export const getAnimeRecommendListApi = (query: {
  limit: number;
  offset: number;
}) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        type: number;
        comic: Anime;
      }>
    >
  >("recs", {
    params: {
      // TODO 不确定该参数为固定还是？
      pos: 3200301,
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export type AnimeDetail = {
  uuid: string; // "a4150105-0810-11f0-b69f-fa163e02432f";
  path_word: string; //"kanchigainoateliermeister";
  free_type: {
    value: number;
    display: string;
  };
  grade: {
    value: number;
    display: string;
  };
  cartoon_type: {
    value: number;
    display: string;
  };
  category: {
    value: number;
    display: string;
  };
  name: string; //"干雜活我乃最強";
  cover: string; //"https://sk.mangafuna.xyz/k/kanchigainoateliermeister/cover/1742752801.jpg.328x422.jpg";
  theme: Array<{
    name: string; // "冒險";
    path_word: string; // "maoxian";
  }>;
  females: Array<unknown>;
  males: Array<unknown>;
  parodies: unknown | null;
  company: {
    name: string;
    path_word: string;
  };
  years: string;
  datetime_updated: string;
  last_chapter: {
    uuid: string; // "082808bd-4499-11f0-8a38-fa163e02432f";
    name: string; // "第11集";
  };
  popular: number;
  b_subtitle: boolean;
  brief: string; //"庫爾特是一個善良的男孩，在英雄的聚會上做雜務，突然被趕出了聚會，因為他「無用」。\r\n而且，事實證明，所有與戰鬥有關的天賦都是最低等的。\r\n庫爾特決定幫忙做各種工作來謀生。\r\n然後，無論他走到哪裡，他都會展現出令人難以置信的驚人才華！\r\n事實上，庫爾特在戰鬥以外的所有領域的能力都擁有最高的SSS等級……！\r\n然而，當事人卻完全不知道這一點，並誤以為這是「家常便飯」。\r\n他最終用無意識的行動拯救了人們，拯救了小鎮，甚至拯救了國家！ ？\r\n一個男孩被英雄的隊伍開除了，他茫然地旅行。";
};

export const getAnimeDetailApi = (animePathWord: string) => {
  return http.Get<
    RespWrapper<{
      collect: number | null;
      popular: number;
      cartoon: AnimeDetail;
    }>
  >(`cartoon/${animePathWord}`);
};

export const collectAnimelApi = (query: {
  animeId: string;
  isCollect: number;
}) => {
  const body = new FormData();
  body.set("cartoon_id", query.animeId);
  body.set("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/cartoon", body);
};

export const getCollectAnimeListApi = (query: {} & PaginationQuery) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        cartoon: Anime;
        uuid: number;
        last_browse: {
          last_browse_id: string;
          last_browse_name: string;
        } | null;
      }>
    >
  >("member/collect/cartoons", {
    params: {
      free_type: 1,
      ordering: "-datetime_modifier",
      limit: query.limit,
      offset: query.offset,
    },
  });
};

export const getAnimeChapterListApi = (query: { animePathWord: string }) => {
  return http.Get<
    RespWrapper<
      ListResultWrapper<{
        name: string; // "第01集";
        uuid: string; // "33b722c7-0d8d-11f0-97a2-fa163e02432f";
        v_cover: string; // "https://sk.mangafuna.xyz/k/kanchigainoateliermeister/vcover/1743356046.jpg";
        lines: Array<{
          name: string; // "線路三";
          path_word: string; // "line3";
          config: boolean;
        }>;
      }>
    >
  >(`cartoon/${query.animePathWord}/chapters`);
};

export const getAnimeChapterDetailApi = (query: {
  animePathWord: string;
  animeChapterUuid: string;
  linePathWord: string;
}) => {
  return http.Get<
    RespWrapper<{
      cartoon: {
        name: string; //"正能量企鵝";
        uuid: string; //"230043a7-1e9f-11f0-ae4b-fa163e02432f";
        path_word: string; //"koupenchan";
      };
      chapter: {
        count: number;
        name: string;
        cover: string;
        vid: unknown | null;
        video: string;
        uuid: string;
        lines: Record<
          string,
          {
            name: string; //"線路一";
            path_word: string; //"line1";
            config: boolean;
          }
        >;
        video_list: unknown | null;
        v_cover: string;
      };
    }>
  >(`cartoon/${query.animePathWord}/chapter/${query.animeChapterUuid}`, {
    params: {
      line: query.linePathWord,
    },
  });
};
