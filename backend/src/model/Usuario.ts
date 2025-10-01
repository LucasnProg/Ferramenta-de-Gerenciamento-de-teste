import { Uuid } from "./Uuid";
import * as crypto from "crypto";

export class Usuario {
    private id: Uuid;
    private name: string;
    private email: string;
    private password: string; 

    constructor(valueName: string, valueEmail: string, valuePassword: string, valueId?: string) {
        this.id = valueId ? new Uuid(valueId) : Uuid.randomGenerator();
        this.name = valueName;
        this.email = valueEmail;
        this.password = valuePassword; 
    }

    public getId(): Uuid {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password; 
    }

   public setPassword(password: string): void {
        if (!Usuario.checkPassword(password)) {
            throw new Error("Senha inválida. Deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.");
        }
        this.password = Usuario.encryptPassword(password);
    }

    public setName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error("O nome não pode ser vazio.");
        }

        if (!Usuario.checkName(name)) {
            throw new Error("Nome inválido. O nome deve conter apenas letras e espaços.");
        }
        this.name = name;
    }

    public setEmail(email: string): void {
        if (!Usuario.checkEmail(email)) {
            throw new Error("Email inválido.");
        }
        this.email = email;
    }

    static checkName(value: string): boolean {
        // Regex que permite apenas letras (maiúsculas e minúsculas) e espaços
        const nameRegex = /^[a-zA-Z\s]+$/;
        return nameRegex.test(value);
    }

    static create(name: string, email: string, password: string, id?: string): Usuario {
        if (!Usuario.checkName(name)) throw new Error("Nome inválido. O nome deve conter apenas letras e espaços.");
        if (!name || !email || !password) throw new Error("Nome, email e senha são obrigatórios.");
        if (!Usuario.checkEmail(email)) throw new Error("Email inválido.");
        if (!Usuario.checkPassword(password)) throw new Error("Senha inválida. Deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.");

        const encryptedPassword = Usuario.encryptPassword(password);
        return new Usuario(name, email, encryptedPassword, id);
    }

    // Regex básico para senha forte
    static checkPassword(value: string): boolean {
        // Exige: 1 minúscula, 1 maiúscula, 1 número, e no mínimo 8 caracteres
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(value);
    }

    static checkEmail(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    static encryptPassword(password: string): string {
        const secret = process.env.ENCRYPTION_KEY || "chave-secreta"; 
        const key = crypto.createHash("sha256").update(secret).digest();
        const iv = Buffer.alloc(16, 0); 
        const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
        const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
        return encrypted.toString("hex");
    }

    static verifyPassword(password: string, hashed: string): boolean {
        const encrypted = this.encryptPassword(password);
        return encrypted === hashed;
    }

    static fromDatabase(name: string, email: string, encryptedPassword: string, id?: string): Usuario {
        return new Usuario(name, email, encryptedPassword, id);
    }

}
