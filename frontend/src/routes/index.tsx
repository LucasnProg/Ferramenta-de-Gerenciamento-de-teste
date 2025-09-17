import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import useAuth from "../hooks/useAuth";

// Importe os novos componentes que criamos
import HomeContent from '../pages/Home/HomeContent';
import EditUser from '../pages/EditUser';
import DeleteUser from '../pages/DeleteUser';

interface PrivateProps {
  Item: React.ComponentType;
}

const Private: FC<PrivateProps> = ({ Item }) => {
  const { signed } = useAuth();
  return signed ? <Item /> : <Login />;
};

const RoutesApp: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />

        {/* Rota de Layout Privada: O componente Home agora envolve outras rotas */}
        <Route path="/home" element={<Private Item={Home} />}>
            {/* Rota Padrão (index) para /home */}
            <Route index element={<HomeContent />} />

            {/* Rotas Filhas que aparecerão dentro do layout Home */}
            <Route path="edit-user" element={<EditUser />} />
            <Route path="delete-user" element={<DeleteUser />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;