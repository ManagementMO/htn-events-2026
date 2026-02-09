"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { AUTH_CREDENTIALS, STORAGE_KEYS } from "@/lib/constants";

type AuthState = {
  isAuthenticated: boolean;
};

type AuthAction = { type: "LOGIN" } | { type: "LOGOUT" };

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true };
    case "LOGOUT":
      return { isAuthenticated: false };
    default:
      return state;
  }
}

function getInitialAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isAuthenticated: false };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "isAuthenticated" in parsed &&
        typeof (parsed as AuthState).isAuthenticated === "boolean"
      ) {
        return { isAuthenticated: (parsed as AuthState).isAuthenticated };
      }
    }
  } catch {
    // Ignore corrupt or inaccessible sessionStorage
  }

  return { isAuthenticated: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialAuthState);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated: state.isAuthenticated })
      );
    } catch {
      // Ignore write failures (e.g. private browsing quota)
    }
  }, [state.isAuthenticated]);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username === AUTH_CREDENTIALS.username &&
      password === AUTH_CREDENTIALS.password
    ) {
      dispatch({ type: "LOGIN" });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback((): void => {
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext value={{ isAuthenticated: state.isAuthenticated, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
