import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isInitialized: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser && savedUser !== 'undefined') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
