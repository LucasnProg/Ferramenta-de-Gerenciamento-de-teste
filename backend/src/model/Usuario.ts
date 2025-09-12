import { Uuid } from "./Uuid";
import * as crypto from 'crypto';

export class Usuario { 
    private id : Uuid;
    private name : string;
    private email : string;
    private password : string;

    private static encryptionKey = crypto.randomBytes(32); 
    private static iv = crypto.randomBytes(16); 

    constructor (valueName : string, valueEmail : string, valuePassword : string, valueId? : string){
        this.id = valueId ? new Uuid(valueId) : Uuid.randomGenerator();
        this.name = valueName;
        this.email = valueEmail;
        this.password = valuePassword;
    }

    public getId(): Uuid {
        return this.id;
    }

    public setId(id: string): void {
        this.id = new Uuid(id);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        if (!Usuario.checkEmail(email)) {
            throw new Error("Email inválido");
        }
        this.email = email;
    }

    public getPassword(): string {
        return Usuario.decryptPassword(this.password);
    }

    public setPassword(password: string): void {
        if (!Usuario.checkPassword(password)) {
            throw new Error("Senha inválida. Deve ter pelo menos 8 caracteres, uma letra maiúscula e um número");
        }
        this.password = Usuario.encryptPassword(password);
    }

    static create(name : string, email : string, password : string, userId? : string){
        if (!this.checkEmail(email)) {
            throw new Error("Email incorreto, verifique e tente novamente");
        }
        if (!this.checkPassword(password)) {
            throw new Error("Senha inválida. Deve ter pelo menos 8 caracteres, uma letra maiúscula e um número");
        }

        const encryptedPassword = this.encryptPassword(password);
        return new Usuario(name, email, encryptedPassword, userId);
    }

    static checkEmail(value : string) : boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    static checkPassword(value : string) : boolean {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(value);
    }

    static encryptPassword(value : string) : string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, this.iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decryptPassword(encryptedValue: string) : string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, this.iv);
        let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
/*
const user = Usuario.create("Lucas", "lucas@example.com", "Senha123");
console.log("Senha encriptada:", user['password']);
console.log("Senha decriptada:", Usuario.decryptPassword(user['password']));*/
