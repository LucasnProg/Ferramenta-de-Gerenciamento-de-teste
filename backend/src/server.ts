import express, { json } from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { router } from "./routes/router";

export class Server{
    private server : express.Application;

    constructor() { 
        this.server = express();
        this.server.use(json());
        this.server.use(router);
    }

    public getServer() : express.Application{
        return this.server;
    }
}