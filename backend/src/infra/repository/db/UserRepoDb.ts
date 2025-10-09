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

    async findByEmail(email: string): Promise<Usuario | null> {
        const user = await this.connection('usuarios').where({ email }).first();
        if (!user) return null;

        return Usuario.fromDatabase(user.name, user.email, user.password, user.id);
    }

    async findById(id: string): Promise<Usuario | null> {
        const user = await this.connection('usuarios').where({ id }).first();
        if (!user) return null;

        return Usuario.fromDatabase(user.name, user.email, user.password, user.id);
    }

    async update(user: Usuario): Promise<void> {
        await this.connection('usuarios')
            .where({ id: user.getId().getValue() })
            .update({
                name: user.getName(),
                email: user.getEmail(),
                password: user.getPassword(),
            });
    }

    async delete(id: string): Promise<void> {
        await this.connection('usuarios').where({ id }).del();
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.connection('usuarios').where({ email }).first();
        return !!user; 
    }

}
