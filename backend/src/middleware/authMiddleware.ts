import { Request, Response, NextFunction } from 'express';
import { UserRepoDb } from '../infra/repository/db/UserRepoDb';
import { Usuario } from '../model/Usuario';

declare global {
    namespace Express {
        interface Request {
            user?: Usuario;
        }
    }
}

const userRepository = new UserRepoDb();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['user-id'] as string;

    if (!userId) {
        return res.status(401).json({ error: 'ID do usuário não fornecido no cabeçalho.' });
    }

    try {
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        req.user = user; 
        next(); 

    } catch (error) {
        return res.status(500).json({ error: 'Erro interno ao autenticar o usuário.' });
    }
};