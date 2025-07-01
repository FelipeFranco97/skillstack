import { loginSuccess } from "./authSlice";

export const loadAuthFromStorage = (store) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    store.dispatch(loginSuccess({ token, user }));
  }
};
