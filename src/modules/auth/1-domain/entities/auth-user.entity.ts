
export enum UserRole {
    ADMIN = 'ADMIN',
    SINDICO = 'SINDICO',
    MORADOR = 'MORADOR',
}

export class AuthUser {
    constructor(
        private readonly _id: string,
        private readonly _email: string,
        private readonly _passwordHash: string,
        private readonly _name: string,
        private readonly _role: UserRole,
        private readonly _condominiumId: string | null,
    ) { }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get name(): string {
        return this._name;
    }

    get role(): UserRole {
        return this._role;
    }

    get condominiumId(): string | null {
        return this._condominiumId;
    }

    static create(
        id: string,
        email: string,
        passwordHash: string,
        name: string,
        role: UserRole,
        condominiumId: string | null = null,
    ): AuthUser {
        return new AuthUser(id, email, passwordHash, name, role, condominiumId);
    }
}
