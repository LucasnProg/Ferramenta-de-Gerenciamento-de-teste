import { Router, Request, Response } from 'express'
import { createUser } from '../controller/CreateUser';
import { UsersList } from '../controller/UsersList';
import { UserRepoDb } from '../infra/repository/db/UserRepoDb';
import { Usuario } from '../model/Usuario';

const router = Router();

const repository = new UserRepoDb();
const UserCreate = new createUser(repository);
const usersLists = new UsersList(repository);


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


export {router};