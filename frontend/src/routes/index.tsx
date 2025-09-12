import React, { Fragment, FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Home from "../pages/Home";
import Signin from "../pages/Login";
import Signup from "../pages/Cadastro";

// Tipagem das props do Private
interface PrivateProps {
  Item: FC;
}

const Private: FC<PrivateProps> = ({ Item }) => {
  const { signed } = useAuth();

  return signed ? <Item /> : <Signin />;
};

const RoutesApp: FC = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/home" element={<Private Item={Home} />} />
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Signin />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
