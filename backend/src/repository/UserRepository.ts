import { Usuario } from "../model/Usuario";

export interface UserRepository {
    save(Usuario: Usuario) : Promise<void>;
    getAll():Promise<Array<Usuario>>;
    findByEmail(email: string): Promise<Usuario | null>; 
    findById(id: string): Promise<Usuario | null>;
    update(usuario: Usuario): Promise<void>;
    delete(id: string): Promise<void>;
}