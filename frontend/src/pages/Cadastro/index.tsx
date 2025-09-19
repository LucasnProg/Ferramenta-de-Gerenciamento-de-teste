import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Cadastro = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConf, setSenhaConf] = useState(""); // apenas confirmação de senha
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { cadastro } = useAuth();

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!name || !email || !senha || !senhaConf) {
    setError("Preencha todos os campos, para efetuar o cadastro!");
    return;
  } else if (senha !== senhaConf) {
    setError("As senhas não coincidem!");
    return;
  }

  if (!passwordRegex.test(senha)) {
    setError("Senha inválida, insira uma senha com no mínimo 8 caracteres, letras maiúsculas e números!");
    return;
  }

  const res = await cadastro(name, email, senha);

  if (res) {
    setError(res);
    return;
  }

  alert("Usuário cadastrado com sucesso!");
  navigate("/");
};


  return (
    <C.Container>
      <C.Label>Cadastrar-se</C.Label>
      <C.Content>
        <Input
          type="text"
          placeholder="Digite seu Nome"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
        />
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => { setSenha(e.target.value); setError(""); }}
        />
        <Input
          type="password"
          placeholder="Confirme sua Senha"
          value={senhaConf}
          onChange={(e) => { setSenhaConf(e.target.value); setError(""); }}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Inscrever-se" onClick={handleSignup} Type="button" />
        <C.LabelSignin>
          Já tem uma conta?
          <C.Strong>
            <Link to="/">&nbsp;Entre</Link>
          </C.Strong>
        </C.LabelSignin>
      </C.Content>
    </C.Container>
  );
};

export default Cadastro;
