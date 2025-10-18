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
    const [loginAttempts, setLoginAttempts] = useState(0);

    const checkNotifications = async (userId: string) => {
      try {
          const res = await fetch(`http://localhost:4000/notifications`, { headers: { 'user-id': userId } });
          if (res.ok) {
              const notifications: { projetoId: number, titulo: string }[] = await res.json();
              if (notifications.length > 0) {
                  const projectNames = notifications.map(n => n.titulo).join(', ');
                  alert(`Você foi adicionado aos seguintes projetos: ${projectNames}`);
                  notifications.forEach(async (n) => {
                      await fetch(`http://localhost:4000/notifications/project/${n.projetoId}`, {
                          method: 'PUT',
                          headers: { 'user-id': userId }
                      });
                  });
              }
          }
      } catch (error) {
          console.error("Erro ao buscar notificações:", error);
      }
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            setError("Preencha todos os campos");
            return;
        }
        
        const result = await login(email, senha);

        if (result) {
            setError(result);
            setLoginAttempts(prevAttempts => prevAttempts + 1);
            return;
        }

        const userToken = localStorage.getItem("user_token");
        if (userToken) {
            const loggedUser = JSON.parse(userToken);
            await checkNotifications(loggedUser.id);
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
                {loginAttempts >= 3 && (
                    <C.ForgotPass>
                        <Link to="/Esqueceu-a-senha">&nbsp;Esqueceu a sua senha?</Link>
                    </C.ForgotPass>
                )}
            </C.Content>
        </C.Container>
    );
};

export default Login;