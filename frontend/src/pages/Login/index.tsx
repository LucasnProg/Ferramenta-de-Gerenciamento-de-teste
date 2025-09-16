import React, { useState, useContext } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

const Login = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!auth) return;

    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    const res = await auth.login(email, senha);
    if (res) {
      setError(res);
      return;
    }

    navigate("/home");
  };

  return (
    <C.Container>
      <C.Label>Entrar</C.Label>
      <C.Content>
        <Input type="email" placeholder="Digite seu E-mail" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
        <Input type="password" placeholder="Digite sua Senha" value={senha} onChange={(e) => { setSenha(e.target.value); setError(""); }} />
        <C.LabelError>{error}</C.LabelError>
        <Button Text="Entrar" onClick={handleLogin} />
        <C.LabelCadastro>
          Não tem uma conta?
          <C.Strong>
            <Link to="/cadastro">&nbsp;Registre-se</Link>
          </C.Strong>
        </C.LabelCadastro>
      </C.Content>
    </C.Container>
  );
};

export default Login;
