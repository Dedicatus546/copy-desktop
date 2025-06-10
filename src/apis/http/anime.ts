import http from "./http";
import { Anime, AnimeDetail, ListResultWrapper, RespWrapper } from "./type";

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
      // TODO pos 不确定该参数为固定还是？
      pos: 3200301,
      offset: query.offset,
      limit: query.limit,
    },
  });
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
