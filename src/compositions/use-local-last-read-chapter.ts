import { StorageSerializers } from "@vueuse/core";

/**
 * @description 非登录下保存在本地下
 */
const useLocalLastReadChapter = (
  pathWord: MaybeRefOrGetter<string>,
  prefix = "",
) => {
  return useStorage<{
    chapterName: string;
    chapterUuid: string;
  }>(
    computed(() => `comic:lastReadChapter:${prefix}:${toValue(pathWord)}`),
    null,
    localStorage,
    // 这里默认值为 null ，必须手动指定序列器
    // 不然 vueuse 无法识别对象类型，导致写入的时候序列化错误
    { serializer: StorageSerializers.object },
  );
};

export default useLocalLastReadChapter;
