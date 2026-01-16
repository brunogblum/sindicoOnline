
export enum UserRole {
    ADMIN = 'ADMIN',
    SINDICO = 'SINDICO',
    MORADOR = 'MORADOR',
}

export class User {
    constructor(
        private readonly _id: string,
        private readonly _email: string,
        private readonly _cpf: string,
        private readonly _passwordHash: string,
        private readonly _name: string,
        private readonly _role: UserRole,
        private readonly _block: string | null,
        private readonly _apartment: string | null,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
        private readonly _deletedAt?: Date | null,
    ) { }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get cpf(): string {
        return this._cpf;
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

    get block(): string | null {
        return this._block;
    }

    get apartment(): string | null {
        return this._apartment;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deletedAt(): Date | null | undefined {
        return this._deletedAt;
    }

    // Factory method for creating a NEW user
    static create(
        id: string,
        email: string,
        cpf: string,
        passwordHash: string,
        name: string,
        role: UserRole,
        block: string | null,
        apartment: string | null,
    ): User {
        const now = new Date();
        return new User(id, email, cpf, passwordHash, name, role, block, apartment, now, now, null);
    }

    // Factory method for reconstructing from DB
    static inflate(
        id: string,
        email: string,
        cpf: string,
        passwordHash: string,
        name: string,
        role: UserRole,
        block: string | null,
        apartment: string | null,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date | null,
    ): User {
        return new User(id, email, cpf, passwordHash, name, role, block, apartment, createdAt, updatedAt, deletedAt);
    }

    public markAsDeleted(): User {
        return new User(
            this._id,
            this._email,
            this._cpf,
            this._passwordHash,
            this._name,
            this._role,
            this._block,
            this._apartment,
            this._createdAt,
            new Date(), // update updatedAt
            new Date(), // set deletedAt
        );
    }

    public update(
        name?: string,
        role?: UserRole,
        passwordHash?: string,
    ): User {
        return new User(
            this._id,
            this._email,
            this._cpf,
            passwordHash || this._passwordHash,
            name || this._name,
            role || this._role,
            this._block,
            this._apartment,
            this._createdAt,
            new Date(), // update updatedAt
            this._deletedAt,
        );
    }
}
