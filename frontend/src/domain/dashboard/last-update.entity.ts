export interface LastUpdate {
    complaintId: string;
    complaintTitle: string;
    type: 'STATUS_CHANGE' | 'NEW_COMMENT';
    detail: string;
    occurredAt: Date;
}
