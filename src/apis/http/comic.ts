import http from "./http";
import {
  Comic,
  ComicDetail,
  ListResultWrapper,
  PaginationQuery,
  RankComic,
  RecComic,
  RespWrapper,
  Series,
  Topic,
} from "./type";

export const getComicIndexApi = () => {
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
