"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext(undefined);

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('@supabase/supabase-js').User | null} props.initialUser
 */
export function AuthProvider({ children, initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser ?? null);

  useEffect(() => {
    setUser(initialUser ?? null);
  }, [initialUser]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
    router.push("/");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: next },
    } = await supabase.auth.getUser();
    setUser(next ?? null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signOut,
      refreshUser,
    }),
    [user, signOut, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
