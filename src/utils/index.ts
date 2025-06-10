export const getLoadedImage = async (src: string) => {
  const img = document.createElement("img");
  // 允许跨域
  img.setAttribute("crossOrigin", "anonymous");
  return new Promise<HTMLImageElement>((resolve, reject) => {
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.addEventListener("error", (e) => {
      reject(e);
    });
    img.src = src;
  });
};

export const resolveDownloadFileName = (comicId: number, name: string) => {
  return `[JM${comicId}] ${name.replace(/[\\/:*?"<>|]/g, "_")}.zip`;
};

export const normalizeError = (err: unknown) => {
  if (err instanceof Error) {
    return ` ${err.message}\n${err.stack}`;
  }
  return String(err);
};

export const delay = async (ts: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ts);
  });
};

/**
 * @description 根据 ref 创建一个 computed ，在 set 中执行 fn
 */
export const createComputed = <T>(
  r: Ref<T>,
  fn: () => void,
  options?: {
    timing: "before" | "after";
  },
) => {
  const { timing = "after" } = options ?? {};
  return computed<T>({
    get() {
      return r.value;
    },
    set(val) {
      if (timing === "before") {
        fn();
      }
      r.value = val;
      if (timing === "after") {
        fn();
      }
    },
  });
};

export const resolveCover = (cover: string) => {
  if (import.meta.env.VITE_NSFW === "on") {
    return "/360x640.svg";
  }
  return cover;
};
