import { Usuario } from "../model/Usuario";

export interface UserRepository {
    save(Usuario: Usuario) : Promise<void>;
    getAll():Promise<Array<Usuario>>;
    findByEmail(email: string): Promise<Usuario | null>; 
}