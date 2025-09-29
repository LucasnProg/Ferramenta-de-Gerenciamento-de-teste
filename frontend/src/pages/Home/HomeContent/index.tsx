import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ContainerTitle, 
    WelcomeTitle, 
    WelcomeText, 
    ProjectCreateBox, 
    ContainerContent, 
    CreateProjectModal,
    ProjectListContainer, 
    ProjectItem 
} from './styles';
import useAuth from '../../../hooks/useAuth';

interface Projeto {
    id: number;
    titulo: string;
    descricao?: string;
}

const HomeContent: React.FC = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState<Projeto[]>([]);

    const fetchProjects = async () => {
        if (!user) return; 
        
        try {
            const response = await fetch("http://localhost:4000/projetos", {
                headers: { "user-id": user.id }
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error("Falha ao buscar projetos:", response.statusText);
            }
        } catch (error) {
            console.error("Erro na requisição para buscar projetos:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    return (
        <>
            <ContainerTitle>
                <WelcomeTitle>
                    Bem-vindo{user && user.name ? `, ${user.name}` : ''}!
                </WelcomeTitle>
                <WelcomeText>
                    Selecione uma opção no menu ao lado ou crie um novo projeto para começar.
                </WelcomeText>
            </ContainerTitle>
            <ContainerContent>
                {showModal && (
                    <CreateProjectModal 
                        onClose={() => setShowModal(false)} 
                        onProjectCreated={fetchProjects} 
                    />
                )}
                <div style={{ width: '100%' }}> 
                    <ProjectCreateBox onClick={() => setShowModal(true)} />
                    <ProjectListContainer>
                        {projects.map((project) => (
                            <Link key={project.id} to={`/home/projeto/${project.id}`} style={{ textDecoration: 'none' }}>
                                <ProjectItem>
                                    <h3>{project.titulo}</h3>
                                </ProjectItem>
                            </Link>
                        ))}
                    </ProjectListContainer>
                </div>
            </ContainerContent>
        </>
    );
};

export default HomeContent;