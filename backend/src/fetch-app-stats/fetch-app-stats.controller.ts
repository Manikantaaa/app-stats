import { Controller, Get, HttpException, InternalServerErrorException } from '@nestjs/common';
import { FetchAppStatsService } from './fetch-app-stats.service';

@Controller('fetch-app-stats')
export class FetchAppStatsController {
    constructor(private readonly fetchAppStatsService: FetchAppStatsService) {}

    @Get()
    async fetchAppStatsData() {
        try {
           const data = await this.fetchAppStatsService.callExternalApi();
      return {
        success: true,
        message: 'External API data fetched successfully',
        data,
      };
        } catch (error) {
            console.error('Error fetching app stats:', error);
            throw new Error('Failed to fetch app stats data.');
        }
    }

    @Get('import-data')
    async fetchAndStore(){
        try {
            await this.fetchAppStatsService.fetchAndStore();
            return { success: true };
        } catch (error) {
            console.error("Controller error:", error);
            throw new InternalServerErrorException("Failed to fetch and store stats")
        }
    }
}
