export const delay = async (ts: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ts);
  });
};

export const resolveCover = (cover: string) => {
  if (import.meta.env.VITE_NSFW === "on") {
    return "/360x640.svg";
  }
  return cover;
};
