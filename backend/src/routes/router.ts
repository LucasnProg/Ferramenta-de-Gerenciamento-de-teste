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
import { CheckEmailExists } from "../controller/CheckEmailExists";
import { ResetPassword } from "../controller/ResetPassword";
import { DeleteProject } from '../controller/DeleteProject';
import { AddParticipant } from "../controller/AddParticipant";
import { GetNotifications } from "../controller/GetNotifications";
import { MarkNotificationRead } from "../controller/MarkNotificationRead";
import { ImportBacklogController } from "../controller/ImportBacklogController";
import { ListBacklogController } from "../controller/ListBacklogController";
import { EditBacklogItemController } from "../controller/EditBackLogController";
import { DeleteBacklogItemController } from "../controller/DeleteBacklogItemController";
import { AddBacklogItemController } from "../controller/AddBacklogItemController";
import { ReorderBacklogController } from "../controller/ReorderBacklogController";
import { CreateCicloDeTesteController } from "../controller/CreateCicloDeTesteController";
import { ListCiclosByProjectController } from "../controller/ListCiclosByProjectController";
import { GetCicloDeTesteByIdController } from "../controller/GetCicloDeTesteByIdController";
import { EditCicloDeTesteController } from "../controller/EditCicloDeTesteController";
import { DeleteCicloDeTesteController } from "../controller/DeleteCicloDeTesteController";
import { CreateTestSuiteController } from "../controller/CreateTestSuiteController";
import { MoveBacklogItemController } from "../controller/MoveBacklogItemController";
import { EditTestSuiteController } from "../controller/EditTestSuiteController";
import { DeleteTestSuiteController } from "../controller/DeleteTestSuiteController";
import { GetTestSuiteResults } from "../controller/GetTestSuiteResults";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ReportTestResultsController } from "../controller/ReportTestResultsController"; 

const router = Router();


const metricsService = new MetricsService();
const usersRepository = new UserRepoDb();
const userCreate = new CreateUser(usersRepository);
const usersList = new UsersList(usersRepository);
const loginUser = new LoginUser(usersRepository);
const editUser = new EditUser(usersRepository);
const deleteUser = new DeleteUser(usersRepository);
const projectRepo = new ProjectRepoDb();
const createProject = new CreateProject(projectRepo);
const listProjectsByUser = new ListProjectsByUser(projectRepo);
const getProjectById = new GetProjectById(projectRepo);
const editProjectController = new EditProject(projectRepo);
const checkEmail = new CheckEmailExists(usersRepository);
const resetPass = new ResetPassword(usersRepository);
const deleteProjectController = new DeleteProject(projectRepo);
const addParticipant = new AddParticipant(projectRepo, usersRepository);
const getNotifications = new GetNotifications(projectRepo);
const markNotificationRead = new MarkNotificationRead(projectRepo);
const importBacklogController = new ImportBacklogController(projectRepo);
const listBacklogController = new ListBacklogController(projectRepo);
const editBacklogItemController = new EditBacklogItemController(projectRepo);
const deleteBacklogItemController = new DeleteBacklogItemController(projectRepo);
const addBacklogItemController = new AddBacklogItemController(projectRepo);
const reorderBacklogController = new ReorderBacklogController(projectRepo);
const createCicloDeTesteController = new CreateCicloDeTesteController(projectRepo);
const listCiclosByProjectController = new ListCiclosByProjectController(projectRepo);
const getCicloDeTesteByIdController = new GetCicloDeTesteByIdController(projectRepo);
const editCicloDeTesteController = new EditCicloDeTesteController(projectRepo);
const deleteCicloDeTesteController = new DeleteCicloDeTesteController(projectRepo);
const createTestSuiteController = new CreateTestSuiteController(projectRepo);
const moveBacklogItemController = new MoveBacklogItemController(projectRepo);
const reportTestResultsController = new ReportTestResultsController(projectRepo); 
const editTestSuiteController = new EditTestSuiteController(projectRepo);
const deleteTestSuiteController = new DeleteTestSuiteController(projectRepo, usersRepository);
const getTestSuiteResults = new GetTestSuiteResults(projectRepo);


// Listar usuários
router.get("/usuarios", (req: Request, res: Response) => {
  usersList.execute(req, res);
});


// Criar usuário
router.post("/usuario", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  metricsService.incrementRegistrationAttempt();


  if (!name || !email || !password) return res.status(400).json({ error: "Preencha todos os campos" });


  try {
    const user = Usuario.create(name, email, password);
    await usersRepository.save(user);


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


// Editar usuario
router.put("/usuario/:id", (req: Request, res: Response) => {
    editUser.execute(req, res);
});


// Excluir usuário
router.delete("/usuario/:id", (req: Request, res: Response) => {
    deleteUser.execute(req, res);
});


// Verificar Email Usuário
router.get("/check-email", (req: Request, res: Response) => {
    checkEmail.execute(req, res);
});


// Troca a senha quando o usuário esquece
router.post("/esqueceu-a-senha", (req: Request, res: Response) => {
    resetPass.execute(req, res);
});


// Excluir Projeto
router.delete('/projeto/:id', authMiddleware, (req: Request, res: Response) => {
    deleteProjectController.execute(req, res)
});


// Adicionar Participante ao Projeto
router.post("/projeto/:id/participante", authMiddleware, (req: Request, res: Response) => addParticipant.execute(req, res));


router.get("/notifications", authMiddleware, (req: Request, res: Response) => getNotifications.execute(req, res));
router.put("/notifications/project/:projectId", authMiddleware, (req: Request, res: Response) => markNotificationRead.execute(req, res));


router.post("/projeto", authMiddleware, (req: Request, res: Response) => createProject.execute(req, res));


router.get("/projetos", authMiddleware, (req: Request, res: Response) => listProjectsByUser.execute(req, res));


router.get("/projeto/:id", authMiddleware, (req: Request, res: Response) => getProjectById.execute(req, res));


router.put('/projeto/:id', authMiddleware,
    (req: Request, res: Response) => { editProjectController.execute(req, res) }
);


const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});




const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Formato de arquivo inválido. Apenas arquivos .csv são permitidos.'));
        }
    }
});


router.post(
    "/projeto/:id/import-backlog",
    authMiddleware,
    upload.single('backlogFile'),
    (req: Request, res: Response) => importBacklogController.execute(req, res)
);


router.get(
    "/projeto/:id/backlog",
    authMiddleware,
    (req: Request, res: Response) => listBacklogController.execute(req, res)
);


router.put(
    "/backlog/:id",
    authMiddleware, //
    (req: Request, res: Response) => editBacklogItemController.execute(req, res)
);


router.delete(
    "/backlog/:id",
    authMiddleware, //
    (req: Request, res: Response) => deleteBacklogItemController.execute(req, res)
);


router.post(
    "/projeto/:projectId/backlog",
    authMiddleware,
    (req: Request, res: Response) => addBacklogItemController.execute(req, res)
);


router.put(
    "/backlog/reorder",
    authMiddleware,
    (req: Request, res: Response) => reorderBacklogController.execute(req, res)
);

router.post(
    "/projeto/:id/ciclo-teste",
    authMiddleware,
    (req: Request, res: Response) => createCicloDeTesteController.execute(req, res)
);

router.get(
    "/projeto/:id/ciclo-teste",
    authMiddleware,
    (req: Request, res: Response) => listCiclosByProjectController.execute(req, res)
);

router.get(
    "/ciclo-teste/:id",
    authMiddleware,
    (req: Request, res: Response) => getCicloDeTesteByIdController.execute(req, res)
);

router.put(
    "/ciclo-teste/:id",
    authMiddleware,
    (req: Request, res: Response) => editCicloDeTesteController.execute(req, res)
);

router.delete(
    "/ciclo-teste/:id",
    authMiddleware,
    (req: Request, res: Response) => deleteCicloDeTesteController.execute(req, res)
);

router.post(
    "/ciclo-teste/:id/suite",
    authMiddleware,
    (req: Request, res: Response) => createTestSuiteController.execute(req, res)
);

router.put(
    "/backlog-item/:itemId/move",
    authMiddleware,
    (req: Request, res: Response) => moveBacklogItemController.execute(req, res)
);

router.post(
    "/suite/:id/report",
    authMiddleware,
    (req: Request, res: Response) => reportTestResultsController.execute(req, res)
);

router.post(
    "/ciclo-teste/:id/suite",
    authMiddleware,
    (req: Request, res: Response) => createTestSuiteController.execute(req, res)
);

router.put(
    "/suite/:id", 
    authMiddleware,
    (req: Request, res: Response) => editTestSuiteController.execute(req, res)
);

router.delete(
    "/suite/:id",
    authMiddleware,
    (req: Request, res: Response) => deleteTestSuiteController.execute(req, res)
);

router.get(
    "/suite/:id/results",
    authMiddleware,
    (req: Request, res: Response) => getTestSuiteResults.execute(req, res)
);

export { router };


