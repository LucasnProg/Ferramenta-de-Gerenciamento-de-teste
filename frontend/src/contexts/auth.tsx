// frontend/contexts/auth.tsx
import { createContext, useEffect, useState, FC, ReactNode } from "react";
import axios from "axios";

// Tipagem do usuário
export interface User {
  name: string;
  email: string;
  senha: string;
}

// Tipagem da resposta do backend
interface AuthResponse {
  user: User;
  token: string;
}

// Tipagem do contexto de autenticação
interface AuthContextType {
  user: User | null;
  signed: boolean;
  login: (email: string, senha: string) => Promise<string | void>;
  cadastro: (name: string, email: string, senha: string) => Promise<string | void>;
  logout: () => void;
}

// Tipagem das props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider com estado e funções
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Carrega token ao iniciar
  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      const tokenData: { email: string; token: string } = JSON.parse(userToken);
      setUser({ name: "", email: tokenData.email, senha: "" });
    }
  }, []);

  // Função de login
  async function login(email: string, password: string): Promise<string | void> {
    try {
      const res = await fetch(`http://localhost:4000/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return data.error;

      setUser(data);
      return;
    } catch (err: any) {
      return err.message;
    }
  }


  // Função de cadastro
  const cadastro = async (name: string, email: string, password: string) => {
    const response = await fetch("http://localhost:4000/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) return data.error;
  };


  // Função de logout
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
