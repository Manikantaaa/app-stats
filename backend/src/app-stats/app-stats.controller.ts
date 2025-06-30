import { Body, Controller, Get, HttpException, InternalServerErrorException, Param, Patch, Post, Query } from '@nestjs/common';
import { AppStatsService } from './app-stats.service';
import { CreateAppStatsDto } from './dto/create-app-stat.dto';
import { UpdateAppStatsDto } from './dto/update-app-stat.dto';

@Controller('app-stats')
export class AppStatsController {

    constructor( private readonly appStatsService: AppStatsService){}

    @Post()
    async create(@Body() createAppStatDto: CreateAppStatsDto) {
       try {
        return await this.appStatsService.create(createAppStatDto);
      } catch (error) {
        console.error('Create AppStats error:', error);
        throw new InternalServerErrorException('Failed to create AppStats');
      }
    }
    @Get()
    async findAll() {
       try {
        return await this.appStatsService.findAll();
      } catch (error) {
        console.error('FindAll AppStats error:', error);
        throw new InternalServerErrorException('Failed to fetch AppStats');
      }
    }

      // @Get(':id')
      // async findOne(@Param('id') id: string) {
      //   try {
      //     return await this.appStatsService.findOne(id);
      //   } catch (error) {
      //     console.error(`FindOne AppStats error for ID ${id}:`, error);
      //     throw new InternalServerErrorException('Failed to fetch AppStat');
      //   }
      // }

      // @Post("/count")
      // async getAppStats(@Body() body: any) {
      //   const { apps, dateFilter, customDates, userId } = body;
      //   return this.appStatsService.getStatsForApps(userId, apps, dateFilter, customDates);
      // }

      @Post('/count')
      async getAppStats(
        @Body()
        body: any
      ) {
        try {
          const { apps, dateFilter, customDates, userId } = body;
          return this.appStatsService.getStatsForApps(userId, apps, dateFilter, customDates);
        } catch (error) {
          console.error('GetStatsForApps error:', error);
          throw new InternalServerErrorException('Failed to get app stats');
        }
      }



  
  }
