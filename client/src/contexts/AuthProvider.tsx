import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getProfile,
  login as loginRequest,
  type LoginData,
} from '../services/authService';
import type { User } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/token';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const token = getToken();

    if (!token) {
      queueMicrotask(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

      return () => {
        isCancelled = true;
      };
    }

    getProfile()
      .then((profile) => {
        if (!isCancelled) {
          setUser(profile);
        }
      })
      .catch(() => {
        removeToken();

        if (!isCancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  async function login(data: LoginData): Promise<void> {
    const response = await loginRequest(data);

    setToken(response.accessToken);

    setUser(response.user);
  }

  function logout(): void {
    removeToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}