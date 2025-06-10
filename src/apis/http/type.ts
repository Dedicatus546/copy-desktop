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
