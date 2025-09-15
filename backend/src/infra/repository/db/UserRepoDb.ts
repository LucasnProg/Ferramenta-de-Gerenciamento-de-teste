import { Knex } from "knex";
import { Usuario } from "../../../model/Usuario";
import { UserRepository } from "../../../repository/UserRepository";
import { db } from "./knex"; 

export class UserRepoDb implements UserRepository {
    private connection: Knex;

    constructor() {
        this.connection = db;
    }

    async save(user: Usuario): Promise<void> {
        await this.connection('usuarios').insert({
            id: user.getId().getValue(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
        });
    }

    async getAll(): Promise<Array<Usuario>> {
        const userCollection: Array<Usuario> = [];

        const usuarios = await this.connection('usuarios').select('*');

        for (const user of usuarios) {
            userCollection.push(
                await Usuario.create(user['name'], user['email'], user['password'], user['id'])
            );
        }

        return userCollection;
    }
}
