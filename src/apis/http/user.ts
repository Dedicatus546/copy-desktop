import http from "./http";
import {
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
