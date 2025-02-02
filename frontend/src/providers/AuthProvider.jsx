import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../contexts/index.jsx";
import { actions as loadingStateActions } from "../slices/loadingStateSlice.js";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Получаем пользователя из локального хранилища
  const currentUser = JSON.parse(localStorage.getItem("userId"));
  const token = localStorage.getItem("userToken");

  // Устанавливаем состояние пользователя
  const [user, setUser] = useState(currentUser ? { ...currentUser, token } : null);

  const logIn = useCallback((data) => {
    localStorage.setItem("userId", JSON.stringify(data));
    localStorage.setItem("userToken", data.token);
    setUser(data);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    dispatch(loadingStateActions.unload());
    setUser(null);
  }, [dispatch]);

  const getAuthHeader = useCallback(() => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  }, [user]);

  const context = useMemo(
    () => ({
      user,
      logIn,
      logOut,
      getAuthHeader,
    }),
    [user, logIn, logOut, getAuthHeader]
  );

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
