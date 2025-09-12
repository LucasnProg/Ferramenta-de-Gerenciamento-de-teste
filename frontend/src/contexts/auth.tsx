import { createContext, useEffect, useState, FC, ReactNode } from "react";

// Tipagem do usuário
interface User {
  email: string;
  senha: string;
}

// Tipagem do contexto de autenticação
interface AuthContextType {
  user: User | null;
  signed: boolean;
  login: (email: string, senha: string) => string | void;
  cadastro: (email: string, senha: string) => string | void;
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

  // Verifica se já existe token no localStorage
  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const userStorage = localStorage.getItem("users_db");

    if (userToken && userStorage) {
      const hasUser = JSON.parse(userStorage).filter(
        (u: User) => u.email === JSON.parse(userToken).email
      );

      if (hasUser.length > 0) setUser(hasUser[0]);
    }
  }, []);

  // Função de login
  const login = (email: string, senha: string): string | void => {
    const userStorage: User[] = JSON.parse(localStorage.getItem("users_db") || "[]");

    const hasUser = userStorage.filter((u) => u.email === email);

    if (hasUser.length) {
      if (hasUser[0].senha === senha) {
        const token = Math.random().toString(36).substring(2);
        localStorage.setItem("user_token", JSON.stringify({ email, token }));
        setUser({ email, senha });
        return;
      } else {
        return "E-mail ou senha incorretos";
      }
    } else {
      return "Usuário não cadastrado no sistema, faça seu cadastro para acessar a plataforma";
    }
  };

  // Função de cadastro
  const cadastro = (email: string, senha: string): string | void => {
    const userStorage: User[] = JSON.parse(localStorage.getItem("users_db") || "[]");

    const hasUser = userStorage.filter((u) => u.email === email);

    if (hasUser.length) {
      return "Já existe uma conta cadastrada com esse e-mail";
    }

    const newUser = [...userStorage, { email, senha }];
    localStorage.setItem("users_db", JSON.stringify(newUser));

    return;
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
