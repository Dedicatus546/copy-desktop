import http from "./http";
import {
  Comment,
  LightNovel,
  LightNovelChapter,
  LightNovelDetail,
  ListResultWrapper,
  PaginationQuery,
  RespWrapper,
} from "./type";

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

export const getLightNovelVolumeListApi = (query: {
  lightNovelPathWord: string;
}) => {
  return http.Get<RespWrapper<ListResultWrapper<LightNovelChapter>>>(
    `book/${query.lightNovelPathWord}/volumes`,
  );
};

export const getLightNovelVolumeApi = (query: {
  lightNovelPathWord: string;
  chapterId: string;
}) => {
  return http.Get<
    RespWrapper<{
      is_lock: boolean;
      is_login: boolean;
      is_mobile_bind: boolean;
      is_vip: boolean;
      book: {
        name: string; //"能夠率直說出喜歡的女生無雙";
        uuid: string; //"e3655f4e-e30c-11ef-afcc-3f487b7d9a9a";
        path_word: string; //"nenggoushuaizhishuochuxihuandenvshengwushuang";
      };
      volume: {
        index: number;
        id: string; //"14156";
        count: number; //2;
        sort: number; //10;
        name: string; //"第1卷";
        txt_addr: string; //"https://hi77-overseas.mangafuna.xyz/book/nenggoushuaizhishuochuxihuandenvshengwushuang/17386831229039563.txt";
        txt_encoding: string; //"GBK";
        book_id: string; //"e3655f4e-e30c-11ef-afcc-3f487b7d9a9a";
        book_path_word: string; //"nenggoushuaizhishuochuxihuandenvshengwushuang";
        contents: Array<{
          name: string; //第一卷 I 女主角竞赛的必胜方法;
          content_type: number; //1;
          content: string | null;
          start_lines: number;
          end_lines: number;
        }>;
        prev: string | null;
        next: string | null;
      };
    }>
  >(`book/${query.lightNovelPathWord}/volume/${query.chapterId}`);
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

export const getLightNovelTxtContentApi = (query: {
  txtUrl: string;
  encoding: string;
}) => {
  return http.Get<RespWrapper<string>>(`getLightNovelTxtContent`, {
    params: {
      q: query.txtUrl,
      encoding: query.encoding,
    },
  });
};
