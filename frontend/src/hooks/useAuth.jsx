import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem('aiInterviewToken'));
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('aiInterviewUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (tokenValue, userValue) => {
    window.localStorage.setItem('aiInterviewToken', tokenValue);
    window.localStorage.setItem('aiInterviewUser', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const logout = () => {
    window.localStorage.removeItem('aiInterviewToken');
    window.localStorage.removeItem('aiInterviewUser');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default useAuth;
