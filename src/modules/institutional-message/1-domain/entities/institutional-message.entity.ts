
export class InstitutionalMessage {
    constructor(
        private readonly _id: string,
        private readonly _content: string,
        private readonly _authorId: string,
        private readonly _condominiumId: string,
        private readonly _isActive: boolean,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
        private readonly _expiresAt?: Date | null,
    ) { }

    get id(): string {
        return this._id;
    }

    get content(): string {
        return this._content;
    }

    get authorId(): string {
        return this._authorId;
    }

    get condominiumId(): string {
        return this._condominiumId;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get expiresAt(): Date | null | undefined {
        return this._expiresAt;
    }

    static create(
        id: string,
        content: string,
        authorId: string,
        condominiumId: string,
        isActive: boolean = true,
        expiresAt?: Date | null,
    ): InstitutionalMessage {
        const now = new Date();
        return new InstitutionalMessage(
            id,
            content,
            authorId,
            condominiumId,
            isActive,
            now,
            now,
            expiresAt,
        );
    }

    static inflate(
        id: string,
        content: string,
        authorId: string,
        condominiumId: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        expiresAt?: Date | null,
    ): InstitutionalMessage {
        return new InstitutionalMessage(
            id,
            content,
            authorId,
            condominiumId,
            isActive,
            createdAt,
            updatedAt,
            expiresAt,
        );
    }
}
