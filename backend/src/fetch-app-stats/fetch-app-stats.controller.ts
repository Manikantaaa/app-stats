import { Controller, Get } from '@nestjs/common';
import { FetchAppStatsService } from './fetch-app-stats.service';

@Controller('fetch-app-stats')
export class FetchAppStatsController {
    constructor(private readonly fetchappstatsservice: FetchAppStatsService) {}

    @Get()
    async fetchAppStatsData() {
        try {
            return await this.fetchappstatsservice.callExternalApi();
        } catch (error) {
            // You can log the error here if needed
            // console.error('Error fetching app stats:', error);
            throw new Error('Failed to fetch app stats data.');
        }
    }
}
