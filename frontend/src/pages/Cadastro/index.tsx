import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import * as C from './styles';

const Cadastro: React.FC = () => {
    const { cadastro } = useAuth();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConf, setSenhaConf] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (!nome || !email || !senha || !senhaConf) {
            return setError("Preencha todos os campos");
        }
        if (senha !== senhaConf) {
            return setError("As senhas não são iguais");
        }

        const result = await cadastro(nome, email, senha);

        if (result) {
            setError(result);
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
                    value={nome}
                    onChange={(e) => [setNome(e.target.value), setError('')]}
                />
                <Input
                    type="email"
                    placeholder="Digite seu E-mail"
                    value={email}
                    onChange={(e) => [setEmail(e.target.value), setError('')]}
                />
                <Input
                    type="password"
                    placeholder="Digite sua Senha"
                    value={senha}
                    onChange={(e) => [setSenha(e.target.value), setError('')]}
                />
                <Input
                    type="password"
                    placeholder="Confirme sua Senha"
                    value={senhaConf}
                    onChange={(e) => [setSenhaConf(e.target.value), setError('')]}
                />
                <C.LabelError>{error}</C.LabelError>
                <Button type="submit" onClick={handleSignup}>
                    Cadastrar
                </Button>
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