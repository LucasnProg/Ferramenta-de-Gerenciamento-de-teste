// frontend/src/contexts/auth.tsx
import { createContext, useEffect, useState, FC, ReactNode } from "react";

// Tipagem do usuário
export interface User {
  name: string;
  email: string;
  senha?: string;
}

// Contexto de autenticação
interface AuthContextType {
  user: User | null;
  signed: boolean;
  login: (email: string, password: string) => Promise<string | void>;
  cadastro: (name: string, email: string, password: string) => Promise<string | void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      const tokenData = JSON.parse(userToken);
      setUser({ name: "", email: tokenData.email });
    }
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<string | void> => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return data.error;

      setUser({ ...data.user });
      localStorage.setItem("user_token", JSON.stringify({ email: data.user.email, token: data.token }));
    } catch (err: any) {
      return "Erro ao conectar com o servidor";
    }
  };

  // Cadastro
  const cadastro = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:4000/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error;
    } catch (err: any) {
      return "Erro ao conectar com o servidor";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, login, cadastro, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
