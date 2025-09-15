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
  const login = async (email: string, senha: string): Promise<string | void> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${import.meta.env.VITE_API_URL}/login`,
        { email, password: senha }
      );

      if (response.status === 200) {
        const loggedUser = response.data.user;
        const token = response.data.token;

        // Salva token
        localStorage.setItem("user_token", JSON.stringify({ email, token }));
        setUser(loggedUser);

        return;
      } else {
        return "E-mail ou senha incorretos";
      }
    } catch (err: any) {
      return err.response?.data?.message || "Erro ao conectar com o servidor";
    }
  };

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
