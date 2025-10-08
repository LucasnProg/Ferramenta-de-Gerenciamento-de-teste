import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import * as C from './styles';

const ForgotPass: React.FC = () => {
    const { resetPass, checkEmailExist } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConf, setSenhaConf] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {

        if (!email || !senha || !senhaConf) {
            return setError("Preencha todos os campos.");
        }

        if (senha !== senhaConf) {
            return setError("As senhas não são iguais.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError("O formato do e-mail é inválido.");
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(senha)) {
            return setError("A senha deve ter no mínimo 8 caracteres, com ao menos uma letra maiúscula, uma minúscula e um número.");
        }

        const emailJaExiste = await checkEmailExist(email);
        if (!emailJaExiste) {
            return setError("Email não cadastrado.");
        }
        
        const result = await resetPass(email, senha);

        if (result) {
            setError(result);
            return;
        }

        alert("Senha alterada com sucesso!");
        navigate("/");
    };

    return (
        <C.Container>
            <C.Label>Recuperação de senha</C.Label>
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
                <Input
                    type="password"
                    placeholder="Confirme sua Senha"
                    value={senhaConf}
                    onChange={(e) => [setSenhaConf(e.target.value), setError('')]}
                />
                <C.LabelError>{error}</C.LabelError>
                <Button type="submit" onClick={handleSignup}>
                    Redefinir Senha
                </Button>
                <C.LabelSignin>
                    Não tem uma conta?
                    <C.Strong>
                        <Link to="/Cadastro">&nbsp;Registrar-se</Link>
                    </C.Strong>
                </C.LabelSignin>
            </C.Content>
        </C.Container>
    );
};

export default ForgotPass;