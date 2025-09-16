import { Router, Request, Response } from 'express'
import { CreateUser } from '../controller/CreateUser';
import { UsersList } from '../controller/UsersList';
import { UserRepoDb } from '../infra/repository/db/UserRepoDb';
import { Usuario } from '../model/Usuario';
import { LoginUser } from '../controller/LoginUser';

const router = Router();

const repository = new UserRepoDb();
const UserCreate = new CreateUser(repository);
const usersLists = new UsersList(repository);
const loginUser = new LoginUser(repository);

router.get("/usuario", (req : Request, res : Response) => {
    usersLists.execute(req,res);
})
router.post("/usuario", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  try {
    const user = Usuario.create(name, email, password);
    await repository.save(user);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/usuario/login", (req: Request, res: Response) => {
  loginUser.execute(req, res);
});

export {router};