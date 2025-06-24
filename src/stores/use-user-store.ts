import { User } from "@/apis";

type State = {
  userInfo: User | null;
  loginInfo: {
    username: string;
    password: string;
  } | null;
};

const useUserStore = defineStore("user", () => {
  // TODO 这里获取把用户信息存下来，然后不用重新调用 login 接口
  // 因为 token 可能有效
  const state = reactive<State>({
    userInfo: null,
    loginInfo: null,
  });

  const isLogin = computed(() => !!state.userInfo?.token);

  const updateUserInfoAction = (userInfo: NonNullable<State["userInfo"]>) => {
    state.userInfo = Object.assign({}, state.userInfo, userInfo);
  };

  const updateLoginInfoAction = (username: string, password: string) => {
    state.loginInfo = {
      username,
      password,
    };
  };

  const logoutAction = () => {
    state.userInfo = null;
    state.loginInfo = null;
  };

  return {
    ...toRefs(state),
    isLogin,
    updateUserInfoAction,
    updateLoginInfoAction,
    logoutAction,
  };
});

export default useUserStore;
