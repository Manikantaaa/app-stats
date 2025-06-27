import { Controller, Get, HttpException, InternalServerErrorException } from '@nestjs/common';
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

    @Get('import-data')
    async fetchAndStore(){
        try {
            await this.fetchappstatsservice.fetchAndStore();
            return { success: true };
        } catch (error) {
            console.error("Controller error:", error);
            throw new InternalServerErrorException("Failed to fetch and store stats")
        }
    }
}
