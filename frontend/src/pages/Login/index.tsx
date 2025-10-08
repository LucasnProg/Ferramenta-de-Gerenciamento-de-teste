import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import * as C from './styles';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !senha) {
            setError("Preencha todos os campos");
            return;
        }
        
        const result = await login(email, senha);

        if (result) {
            setError(result);
            return;
        }

        navigate('/home');
    };

    return (
        <C.Container>
            <C.Label>Entrar</C.Label>
            <C.Content>
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
                <C.LabelError>{error}</C.LabelError>
                <Button type="submit" onClick={handleLogin}>
                    Entrar
                </Button>
                <C.LabelSignup>
                    Não tem uma conta?
                    <C.Strong>
                        <Link to="/cadastro">&nbsp;Registre-se</Link>
                    </C.Strong>
                </C.LabelSignup>
            </C.Content>
        </C.Container>
    );
};

export default Login;