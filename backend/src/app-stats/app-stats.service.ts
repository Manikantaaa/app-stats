import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppStatDto } from './dto/create-app-stat.dto';
import { UpdateAppStatDto } from './dto/update-app-stat.dto';
import { connect } from 'http2';
import {  subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AppStatsService {
    constructor(private prisma: PrismaService){}

    async create(data: CreateAppStatDto){
        try{
         await this.prisma.appStats.create({
            data: {
                as_date: new Date(data.as_date),
                as_count: data.as_count,
                as_status: data.as_status,
                userApp: {
                connect: {
                    ua_id: data.as_ua_id,
                },
                },
                appApi: {
                connect: {
                    ai_id: data.as_ai_id,
                },
                },
            },
            });
            return{
                success: true,
                message: "AppStats Created Successfully",
            }
        } catch (err){
            throw new InternalServerErrorException("Failed to create AppStat")
        }
    }

    async findAll() {
        try {
        const records = await this.prisma.appStats.findMany({
          include:{
            userApp:{
              select:{
                app:{
                  select:{
                    app_name:true
                  }
                }
              }
            }
          }
        });
        return {
            success: true,
            message: 'AppStats retrieved successfully',
            data: records,
        };
        } catch (error) {
        console.error('FindAll AppStats Error:', error);
        throw new InternalServerErrorException('Failed to fetch AppStats');
        }
    }


    async findOne(id: number) {
        try {
        const record = await this.prisma.appStats.findUnique({
            where: { as_id: id },
        });

        if (!record) {
            throw new NotFoundException(`AppStat with ID ${id} not found`);
        }

        return {
            success: true,
            message: 'AppStat retrieved successfully',
            data: record,
        };
        } catch (error) {
        console.error('FindOne AppStat Error:', error);
        throw error;
        }
    }


async getStatsForApps(
  userId: number,
  appNames: string[],
  dateFilter: string,
  customDates: { from: string; to: string }
) {
  const appStats: { name: string; count: number }[] = [];

  for (const appName of appNames) {
    const userApp = await this.prisma.userApp.findFirst({
      where: {
        ua_u_id: userId,
        app: { app_name: appName },
      },
      include: { app: true },
    });

    if (!userApp) continue;

    let dateWhere: any = {};
    const today = new Date();

    switch (dateFilter) {
      case 'Today':
        dateWhere = {
          gte: startOfDay(today),
          lte: endOfDay(today),
        };
        break;

      case 'Yesterday':
        const yesterday = subDays(today, 1);
        dateWhere = {
          gte: startOfDay(yesterday),
          lte: endOfDay(yesterday),
        };
        break;

           case '1 week':
        const lastWeek = subWeeks(today, 1);
        dateWhere = {
          gte: startOfDay(lastWeek),
          lte: endOfDay(today),
        };
        break;

      case '1 month':
        const lastMonth = subMonths(today, 1);
        dateWhere = {
          gte: startOfDay(lastMonth),
          lte: endOfDay(today),
        };
        break;

      case 'Custom':
        if (customDates.from && customDates.to) {
          dateWhere = {
            gte: new Date(customDates.from),
            lte: new Date(customDates.to),
          };
        }
        break;

      default:
        break;
    }

    const stats = await this.prisma.appStats.aggregate({
      where: {
        as_ua_id: userApp.ua_id,
        as_date: dateWhere,
      },
      _sum: { as_count: true },
    });

    appStats.push({
      name: appName,
      count: stats._sum.as_count || 0,
    });
  }

  return appStats;
}

}

