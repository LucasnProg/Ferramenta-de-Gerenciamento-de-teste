import React, { useState, useEffect } from 'react';
import Input from '../Input';
import Button from '../Button';
import { Overlay, ModalContainer, Title, Message, Form, ErrorText, ButtonGroup } from './styles';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  isLoading: boolean;
  error: string | null;
  onConfirm: (email: string, password: string) => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  isOpen, title, message, isLoading, error, onConfirm, onCancel
}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(email, password);
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Confirme seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Adiciona validação básica do navegador
          />
          <Input
            type="password"
            placeholder="Confirme sua Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <ButtonGroup>
            <Button type="button" onClick={onCancel} style={{ backgroundColor: '#6c757d' }} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: '#d9534f' }} disabled={isLoading}>
              {isLoading ? 'Confirmando...' : 'Confirmar Exclusão'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmationModal;