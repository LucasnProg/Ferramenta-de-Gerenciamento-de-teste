import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";
import { Usuario } from "../model/Usuario";

export class createUser{
    constructor( readonly repository: UserRepository){

    }

    async execute(req : Request, res : Response){
        const {name, email, senha} = req.body;
        const user = Usuario.create(name, email, senha);

        await this.repository.save(user);

        res.status(201).json({user});
    }
}