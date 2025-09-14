// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types/auth.type";

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(authService.getUser());

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
