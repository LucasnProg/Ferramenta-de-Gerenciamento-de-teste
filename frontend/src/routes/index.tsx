import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import useAuth from "../hooks/useAuth";
import HomeContent from '../pages/Home/HomeContent';
import EditUser from '../pages/EditUser';
import DeleteUser from '../pages/DeleteUser';
import ProjectDetail from "../pages/ProjectDetail";
import EditProjectPage from '../pages/EditProjectPage';
import ForgotPass from "../pages/ForgotPass";
import CreateTestCyclePage from "../pages/CreateTestCyclePage";
import TestCycleDetail from "../pages/TestCycleDetail";
import TestReport from "../pages/TestReport";

const Private: FC<{ children: React.ReactElement }> = ({ children }) => {
    const { signed } = useAuth();
    return signed ? children : <Navigate to="/" />;
};

const RoutesApp: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Cadastro" element={<Cadastro />} />
                <Route path="/Esqueceu-a-senha" element={<ForgotPass />} />
                
                <Route path="/home" element={<Private><Home /></Private>}>
                    <Route index element={<HomeContent />} />
                    <Route path="edit-user" element={<EditUser />} />
                    <Route path="delete-user" element={<DeleteUser />} />
                    <Route path="projeto/:id" element={<ProjectDetail />} />
                    <Route path="projeto/editar/:id" element={<EditProjectPage />} />
                    <Route path="projeto/:id/novo-ciclo" element={<CreateTestCyclePage />} />
                    <Route path="ciclo-teste/:cicloId" element={<TestCycleDetail />} />
                    <Route path="ciclo-teste/:cicloId/suite/:suiteId/relatorio" element={<TestReport />} />
                </Route>

                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesApp;