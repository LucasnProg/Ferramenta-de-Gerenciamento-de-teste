import { useContext } from "react";
import { AuthContext, User } from "../contexts/auth";

interface AuthContextType {
  user: User | null;
  signed: boolean;
  login: (email: string, senha: string) => Promise<string | void>;
  cadastro: (name: string, email: string, senha: string) => Promise<string | void>;
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
