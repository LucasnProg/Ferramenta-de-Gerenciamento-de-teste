let registrationTentCadastro: number = 0;
let successCadastro: number = 0;

export class MetricsService {
    
    

    public incrementRegistrationAttempt(): void {
        registrationTentCadastro += 1;
        console.log("Tentativa de cadastro incrementada. Total:", registrationTentCadastro);
        console.log("Métrica de Qualidade - Cadastro - ", successCadastro,"/", registrationTentCadastro, " :", successCadastro/registrationTentCadastro);
    }

    public incrementSuccessfulRegistration(): void {
        successCadastro += 1;
        console.log("Sucesso de cadastro incrementado. Total:", successCadastro);
        console.log("Métrica de Qualidade - Cadastro - ", successCadastro,"/", registrationTentCadastro, " :", successCadastro/registrationTentCadastro);
    }
    
    public getMetrics() {
        return {
            attempts: registrationTentCadastro,
            successes: successCadastro,
        };
    }
}