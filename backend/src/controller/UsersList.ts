import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";

export class UsersList{
    constructor( readonly repository: UserRepository){

    }

    async execute(req : Request, res : Response){
        const userCollection = await this.repository.getAll();

        res.status(200).json({userCollection});
    }
}