import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): {
        ok: boolean;
    };
    getDbHealth(): Promise<{
        db: string;
    }>;
}
