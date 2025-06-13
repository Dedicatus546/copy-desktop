import http from "./http";
import {
  Anime,
  Comic,
  LightNovel,
  ListResultWrapper,
  PaginationQuery,
  RespWrapper,
} from "./type";

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
  const sp = new URLSearchParams();
  sp.append("comic_id", query.comicId);
  sp.append("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/comic", sp.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });
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

export const collectLightNovelApi = (query: {
  lightNovelId: string;
  isCollect: number;
}) => {
  const sp = new URLSearchParams();
  sp.append("book_id", query.lightNovelId);
  sp.append("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/book", sp, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });
};

export const collectAnimelApi = (query: {
  animeId: string;
  isCollect: number;
}) => {
  const sp = new URLSearchParams();
  sp.append("cartoon_id", query.animeId);
  sp.append("is_collect", query.isCollect + "");
  return http.Post<RespWrapper<void>>("member/collect/cartoon", sp, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });
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

export const getHistoryComicListApi = (query: {} & PaginationQuery) => {
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
  >("member/browse/comics", {
    params: {
      offset: query.offset,
      limit: query.limit,
    },
  });
};

export const getHistoryLightNovelListApi = (query: {} & PaginationQuery) => {
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
  >("member/browse/books", {
    params: {
      offset: query.offset,
      limit: query.limit,
    },
  });
};
export const getHistoryAnimeListApi = (query: {} & PaginationQuery) => {
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
  >("member/browse/cartoons", {
    params: {
      offset: query.offset,
      limit: query.limit,
    },
  });
};
