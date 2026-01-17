export interface LastAdministrativeUpdateProps {
    complaintId: string;
    complaintTitle: string;
    type: 'STATUS_CHANGE' | 'NEW_COMMENT';
    detail: string;
    occurredAt: Date;
}

export class LastAdministrativeUpdate {
    private constructor(private readonly props: LastAdministrativeUpdateProps) { }

    public static create(props: LastAdministrativeUpdateProps): LastAdministrativeUpdate {
        return new LastAdministrativeUpdate(props);
    }

    get complaintId(): string {
        return this.props.complaintId;
    }

    get complaintTitle(): string {
        return this.props.complaintTitle;
    }

    get type(): 'STATUS_CHANGE' | 'NEW_COMMENT' {
        return this.props.type;
    }

    get detail(): string {
        return this.props.detail;
    }

    get occurredAt(): Date {
        return this.props.occurredAt;
    }
}
