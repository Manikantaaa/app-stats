import { Body, Controller, Get, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { AppStatsService } from './app-stats.service';
import { CreateAppStatDto } from './dto/create-app-stat.dto';
import { UpdateAppStatDto } from './dto/update-app-stat.dto';

@Controller('app-stats')
export class AppStatsController {

    constructor( private readonly appStatsService: AppStatsService){}

    @Post()
    async create(@Body() createAppStatDto: CreateAppStatDto) {
        try {
        return await this.appStatsService.create(createAppStatDto);
        } catch (error) {
        throw new HttpException('Internal server error', 500);
  }
}
    @Get()
    async findAll() {
        try {
        return await this.appStatsService.findAll();
        } catch (error) {
        throw new HttpException('Internal server error', 500 );
        }
    }


  @Post("/count")
  async getAppStats(@Body() body: any) {
    const { apps, dateFilter, customDates, userId } = body;
    return this.appStatsService.getStatsForApps(userId, apps, dateFilter, customDates);
  }


    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     try {
    //     return await this.appStatsService.findOne(+id);
    //     } catch (error) {
    //         throw new HttpException('Internal server error', 500 );
    //     }
    // }

  
  }
