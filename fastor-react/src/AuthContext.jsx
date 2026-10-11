import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "fastor_auth";
const AuthContext = createContext(null);

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStored);

  const signIn = useCallback((token, phone) => {
    const next = { token, phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ token: session?.token ?? null, phone: session?.phone ?? "", signIn, signOut }),
    [session, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
