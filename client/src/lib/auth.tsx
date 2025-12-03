import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  adminLogin,
  adminLogout,
  checkAdminStatus,
  AuthStatusResponse,
} from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const status: AuthStatusResponse = await checkAdminStatus();
      setIsAuthenticated(status.isAuthenticated);
      setUsername(status.username || null);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: any) => {
    setIsLoading(true);
    try {
      await adminLogin(credentials);
      await checkAuth();
    } catch (error) {
      setIsLoading(false);
      throw new Error("Login failed");
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await adminLogout();
      setIsAuthenticated(false);
      setUsername(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    username,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
