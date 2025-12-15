import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): {
        ok: boolean;
    };
    getDbHealth(): Promise<{
        db: string;
    }>;
}
