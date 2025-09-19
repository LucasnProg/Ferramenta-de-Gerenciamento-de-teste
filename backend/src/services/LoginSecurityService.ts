const loginAttempts = new Map<string, { count: number, blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 5;

export class LoginSecurityService {

    public checkAndRegisterAttempt(email: string): void {
        const attemptInfo = loginAttempts.get(email);
        const now = Date.now();

        if (attemptInfo && attemptInfo.blockedUntil > now) {
            throw new Error("Muitas tentativas. Tente novamente em alguns minutos.");
        }

        const currentAttempts = (attemptInfo?.count || 0) + 1;
        
        if (currentAttempts >= MAX_ATTEMPTS) {
            const blockedUntil = now + (BLOCK_DURATION_MINUTES * 60 * 1000);
            loginAttempts.set(email, { count: currentAttempts, blockedUntil });
        } else {
            loginAttempts.set(email, { count: currentAttempts, blockedUntil: 0 });
        }
    }

    public resetAttempts(email: string): void {
        loginAttempts.delete(email);
    }
}
export const loginSecurityService = new LoginSecurityService();