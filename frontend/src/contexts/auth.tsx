import { createContext, useEffect, useState, FC, ReactNode } from "react";

// Tipagem do usuário
export interface User {
  id: string;
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
  updateUser: (data: Partial<User>) => void;
  checkEmailExist: (emailInput: string) => Promise<boolean>;
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
      setUser(JSON.parse(userToken));
    }
  }, []);

  const updateUser = (data: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) {
        return null;
      }
      const updatedUser = { ...currentUser, ...data } as User;
      localStorage.setItem("user_token", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

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

      setUser(data.user);
      localStorage.setItem("user_token", JSON.stringify(data.user));
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


  const checkEmailExist = async (emailInput: string): Promise<boolean> => {
    try {
      const res = await fetch(`http://localhost:4000/check-email?email=${encodeURIComponent(emailInput)}`, {
        method: "GET"
      });

      if (!res.ok) {
        console.error("Erro ao verificar e-mail:", await res.text());
        return false; 
      }

      const data = await res.json();
      return data.exists;

    } catch (err: any) {
      console.error("Erro ao conectar com o servidor:", err);
      return false; 
    }
}
  return (
    <AuthContext.Provider value={{ user, signed: !!user, login, cadastro, logout, updateUser, checkEmailExist}}>
      {children}
    </AuthContext.Provider>
  );
};