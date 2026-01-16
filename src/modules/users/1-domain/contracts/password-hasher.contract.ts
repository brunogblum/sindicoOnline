export interface PasswordHasherContract {
    hash(password: string): Promise<string>;
    compare(plain: string, hashed: string): Promise<boolean>;
}
