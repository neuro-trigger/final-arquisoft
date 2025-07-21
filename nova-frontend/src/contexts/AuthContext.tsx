'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DecodedToken } from '@/utils/auth';
import apiClient from '@/services/api';

interface AuthContextType {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (userData: DecodedToken) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
  login: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (userData: DecodedToken) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
      // Clear API client state
      apiClient.setUserId(null);
      apiClient.setUserEmail(null);
      apiClient.setUsername(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData: DecodedToken = JSON.parse(storedUser);
          
          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (userData.exp > currentTime) {
            console.log('Valid stored user found');
            setUser(userData);
            setIsAuthenticated(true);
            
            // Set user data in API client
            apiClient.setUserId(userData.userID);
            apiClient.setUserEmail(userData.email);
            apiClient.setUsername(userData.username);
          } else {
            console.log('Stored user token expired');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('No stored user found');
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 