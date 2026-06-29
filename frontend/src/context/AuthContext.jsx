import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tok);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.clear();
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
