"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [jwtLoading, setJwtLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/jwt", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Session sync failed:", error);
      setUser(null);
      setToken(null);
    } finally {
      setJwtLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (isPending) return;

    const sync = async () => {
      if (!session?.user) {
        if (active) {
          setUser(null);
          setToken(null);
          setJwtLoading(false);
        }
        return;
      }

      if (active) setJwtLoading(true);
      try {
        const res = await fetch("/api/jwt", { cache: "no-store" });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          setUser(data.user);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setJwtLoading(false);
      }
    };

    sync();
    return () => {
      active = false;
    };
  }, [session?.user, isPending]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setToken(null);
  };

  const loading = isPending || jwtLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
