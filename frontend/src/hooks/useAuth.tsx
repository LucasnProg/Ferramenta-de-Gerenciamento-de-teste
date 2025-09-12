import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

// Tipagem do usuário
interface User {
  email: string;
  senha: string;
}

// Tipagem do contexto
interface AuthContextType {
  user: User | null;
  signed: boolean;
  login: (email: string, senha: string) => string | void;
  cadastro: (email: string, senha: string) => string | void;
  logout: () => void;
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context as AuthContextType;
};

export default useAuth;
