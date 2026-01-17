export class GetLastUpdateResponseDto {
    complaintId: string;
    complaintTitle: string;
    type: 'STATUS_CHANGE' | 'NEW_COMMENT';
    detail: string;
    occurredAt: string; // ISO format
}
