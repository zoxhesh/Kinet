/**
 * App Providers
 * Theme, Toast, Database, Auth
 */

import React from 'react';
import { View, StyleSheet, Appearance, useColorScheme } from 'react-native';
import { ToastProvider } from '@/components/primitives/Toast';
import { database, initializeDatabase } from '@/db';

// Theme Context
interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  themePreference: 'light' | 'dark' | 'system';
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = React.useState<'light' | 'dark' | 'system'>('system');
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const updateScheme = () => {
      if (preference === 'system') {
        setColorScheme(systemScheme || 'light');
      } else {
        setColorScheme(preference);
      }
    };
    updateScheme();
  }, [systemScheme, preference]);

  const toggleTheme = () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setPreference(newScheme);
    setColorScheme(newScheme);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreference(theme);
    if (theme !== 'system') {
      setColorScheme(theme);
    } else {
      setColorScheme(systemScheme || 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme, setTheme, themePreference: preference }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Auth Context
interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    try {
      const users = await database.collections.get('users').query().fetch();
      setUser(users[0] || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    // TODO: Implement Supabase Auth
    // For now, create local user
    await database.write(async () => {
      const existing = await database.collections.get('users')
        .query()
        .where('email', email)
        .fetch();
      if (existing.length > 0) {
        setUser(existing[0]);
      } else {
        const newUser = await database.collections.get('users').create(u => {
          u.email = email;
          u.username = email.split('@')[0];
          u.createdAt = new Date();
          u.updatedAt = new Date();
        });
        setUser(newUser);
      }
    });
  };

  const signup = async (email: string, password: string, username: string) => {
    await database.write(async () => {
      const existing = await database.collections.get('users')
        .query()
        .where('email', email)
        .fetch();
      if (existing.length > 0) throw new Error('Email already registered');

      const newUser = await database.collections.get('users').create(u => {
        u.email = email;
        u.username = username;
        u.createdAt = new Date();
        u.updatedAt = new Date();
      });
      setUser(newUser);
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main Providers Component
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;