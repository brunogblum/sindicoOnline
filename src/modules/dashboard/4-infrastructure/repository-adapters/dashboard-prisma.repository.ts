import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { DashboardMetrics } from '../../1-domain/value-objects/dashboard-metrics.value-object';
import { LastAdministrativeUpdate } from '../../1-domain/value-objects/last-administrative-update.value-object';
import { PrismaService } from '../../../prisma/prisma.service';

export class DashboardPrismaRepository implements DashboardRepositoryContract {
    constructor(private readonly prisma: PrismaService) { }

    async getMetrics(authorId?: string): Promise<DashboardMetrics> {
        // Status Count
        const statusGroups = await this.prisma.complaint.groupBy({
            by: ['status'],
            _count: {
                status: true
            },
            where: authorId ? { authorId } : {}
        });

        const statusDistribution = statusGroups.map((group: any) => ({
            status: group.status,
            count: group._count.status
        }));

        // Category Count (Last 30 days)
        const date30DaysAgo = new Date();
        date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

        const categoryGroups = await this.prisma.complaint.groupBy({
            by: ['category'],
            _count: {
                category: true
            },
            where: {
                createdAt: {
                    gte: date30DaysAgo
                },
                ...(authorId ? { authorId } : {})
            }
        });

        const categoryDistribution = categoryGroups.map((group: any) => ({
            category: group.category,
            count: group._count.category
        }));

        // Average Response Time
        const complaints = await this.prisma.complaint.findMany({
            where: authorId ? { authorId, deletedAt: null } : { deletedAt: null },
            include: {
                statusHistory: {
                    orderBy: { changedAt: 'asc' },
                    where: {
                        previousStatus: 'PENDENTE'
                    }
                },
                internalComments: {
                    orderBy: { createdAt: 'asc' },
                    take: 1
                }
            }
        });

        const respondedTimes = complaints.map(complaint => {
            const firstStatusChange = complaint.statusHistory[0]?.changedAt;
            const firstComment = complaint.internalComments[0]?.createdAt;

            let responseDate: Date | null = null;
            if (firstStatusChange && firstComment) {
                responseDate = firstStatusChange < firstComment ? firstStatusChange : firstComment;
            } else {
                responseDate = firstStatusChange || firstComment || null;
            }

            if (responseDate) {
                return responseDate.getTime() - complaint.createdAt.getTime();
            }
            return null;
        }).filter((time): time is number => time !== null);

        const averageResponseTime = respondedTimes.length > 0
            ? respondedTimes.reduce((acc, current) => acc + current, 0) / respondedTimes.length
            : null;

        // Alerts (only for Morador dashboard)
        const alerts: any[] = [];
        if (authorId) {
            // 1. Pending Response Alert
            // Check if any status in distribution is PENDENTE or EM_ANALISE with count > 0
            const hasPendingOrInAnalysis = statusDistribution.some(
                s => (s.status === 'PENDENTE' || s.status === 'EM_ANALISE') && s.count > 0
            );
            if (hasPendingOrInAnalysis) {
                alerts.push({
                    type: 'PENDING_RESPONSE',
                    message: 'Você possui reclamações aguardando resposta'
                });
            }

            // 2. Recent Update Alert
            // Check status changes in the last 24h for this author's complaints
            const date24hAgo = new Date();
            date24hAgo.setHours(date24hAgo.getHours() - 24);

            const recentStatusChanges = await this.prisma.complaintStatusHistory.findFirst({
                where: {
                    complaint: {
                        authorId,
                    },
                    changedAt: {
                        gte: date24hAgo
                    },
                    newStatus: {
                        in: ['RESOLVIDA', 'REJEITADA', 'EM_ANALISE']
                    }
                }
            });

            if (recentStatusChanges) {
                alerts.push({
                    type: 'RECENT_UPDATE',
                    message: 'Uma ou mais reclamações suas foram atualizadas recentemente'
                });
            }
        }

        return DashboardMetrics.create({
            statusDistribution,
            categoryDistribution,
            averageResponseTime,
            alerts
        });
    }

    async getLastAdministrativeUpdate(userId: string): Promise<LastAdministrativeUpdate | null> {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 3); // Considerar apenas os últimos 3 dias como "recente"

        // Find latest status change not by user
        const lastStatusChange = await this.prisma.complaintStatusHistory.findFirst({
            where: {
                complaint: { authorId: userId },
                changedBy: { not: userId },
                changedAt: { gte: dateLimit }
            },
            orderBy: { changedAt: 'desc' },
            include: { complaint: true }
        });

        // Find latest comment not by user
        const lastComment = await this.prisma.internalComment.findFirst({
            where: {
                complaint: { authorId: userId },
                authorId: { not: userId },
                createdAt: { gte: dateLimit }
            },
            orderBy: { createdAt: 'desc' },
            include: { complaint: true }
        });

        if (!lastStatusChange && !lastComment) return null;

        let mostRecent: any;
        let type: 'STATUS_CHANGE' | 'NEW_COMMENT';

        const lastStatusChangeDate = lastStatusChange?.changedAt || new Date(0);
        const lastCommentDate = lastComment?.createdAt || new Date(0);

        if (lastStatusChangeDate >= lastCommentDate) {
            mostRecent = lastStatusChange;
            type = 'STATUS_CHANGE';
        } else {
            mostRecent = lastComment;
            type = 'NEW_COMMENT';
        }

        const formatStatus = (status: string) => {
            const map: Record<string, string> = {
                'PENDENTE': 'Pendente',
                'EM_ANALISE': 'Em análise',
                'RESOLVIDA': 'Resolvida',
                'REJEITADA': 'Rejeitada'
            };
            return map[status] || status;
        };

        return LastAdministrativeUpdate.create({
            complaintId: mostRecent.complaintId,
            complaintTitle: mostRecent.complaint.description.length > 50
                ? mostRecent.complaint.description.substring(0, 50) + '...'
                : mostRecent.complaint.description,
            type,
            detail: type === 'STATUS_CHANGE'
                ? `Status alterado de ${formatStatus(mostRecent.previousStatus)} para ${formatStatus(mostRecent.newStatus)}`
                : mostRecent.content.length > 100
                    ? mostRecent.content.substring(0, 100) + '...'
                    : mostRecent.content,
            occurredAt: type === 'STATUS_CHANGE' ? mostRecent.changedAt : mostRecent.createdAt
        });
    }
}
