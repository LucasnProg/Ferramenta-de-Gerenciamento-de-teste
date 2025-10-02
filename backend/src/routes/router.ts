import { Router, Request, Response } from "express";
import { CreateUser } from "../controller/CreateUser";
import { UsersList } from "../controller/UsersList";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";
import { Usuario } from "../model/Usuario";
import { LoginUser } from "../controller/LoginUser";
import { MetricsService } from "../services/MetricsService"; 
import { EditUser } from "../controller/EditUser";
import { DeleteUser } from "../controller/DeleteUser";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { CreateProject } from "../controller/CreateProject";
import { authMiddleware } from "../middleware/authMiddleware";
import { ListProjectsByUser } from "../controller/ListProjectsByUser";
import { GetProjectById } from "../controller/GetProjectById";
import { EditProject } from '../controller/EditProject';



const router = Router();

const metricsService = new MetricsService();
const repository = new UserRepoDb();
const userCreate = new CreateUser(repository);
const usersList = new UsersList(repository);
const loginUser = new LoginUser(repository);
const editUser = new EditUser(repository);
const deleteUser = new DeleteUser(repository);
const projectRepo = new ProjectRepoDb();
const createProject = new CreateProject(projectRepo);
const listProjectsByUser = new ListProjectsByUser(projectRepo);
const getProjectById = new GetProjectById(projectRepo);
const editProjectController = new EditProject(projectRepo);

// Listar usuários
router.get("/usuario", (req: Request, res: Response) => {
  usersList.execute(req, res);
});

// Criar usuário
router.post("/usuario", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  metricsService.incrementRegistrationAttempt();

  if (!name || !email || !password) return res.status(400).json({ error: "Preencha todos os campos" });

  try {
    const user = Usuario.create(name, email, password);
    await repository.save(user);

  const isPasswordCorrect = Usuario.verifyPassword(password, user.getPassword());

        if (isPasswordCorrect) {
          metricsService.incrementSuccessfulRegistration();
        } else {
        res.status(500).json({ error: "Erro na verificação da senha após o cadastro." });
        }
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", (req: Request, res: Response) => {
  loginUser.execute(req, res);
});

//Editar usuario
router.put("/usuario/:id", (req: Request, res: Response) => {
    editUser.execute(req, res);
});

// Excluir usuário
router.delete("/usuario/:id", (req: Request, res: Response) => {
    deleteUser.execute(req, res);
});


router.post("/projeto", authMiddleware, (req: Request, res: Response) => createProject.execute(req, res));

router.get("/projetos", authMiddleware, (req, res) => listProjectsByUser.execute(req, res));

router.get("/projeto/:id", authMiddleware, (req, res) => getProjectById.execute(req, res));

router.put('/projeto/:id', (req: Request, res: Response) => {
  editProjectController.execute(req, res)});

export { router };
