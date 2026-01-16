import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { DashboardMetrics } from '../../1-domain/value-objects/dashboard-metrics.value-object';
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

        return DashboardMetrics.create({
            statusDistribution,
            categoryDistribution
        });
    }
}
