import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AuthContext } from '../contexts/index.jsx';
import { actions as loadingStateActions } from '../slices/loadingStateSlice.js';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Получаем пользователя из локального хранилища
  const currentUser = JSON.parse(localStorage.getItem('userId'));
  const token = localStorage.getItem('userToken');

  // Устанавливаем состояние пользователя
  const [user, setUser] = useState(currentUser ? { ...currentUser, token } : null);

  const logIn = useCallback((data) => {
    localStorage.setItem('userId', JSON.stringify(data));
    localStorage.setItem('userToken', data.token);
    setUser(data);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    dispatch(loadingStateActions.unload());
    setUser(null);
  }, [dispatch]);

  const getAuthHeader = useCallback(
    () => (user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    [user]
  );

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
