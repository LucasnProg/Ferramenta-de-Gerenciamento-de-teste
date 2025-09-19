import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import useAuth from "../hooks/useAuth";

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
      <Route path="/home" element={<Private Item={Home} />} />
        <Route path="/" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
