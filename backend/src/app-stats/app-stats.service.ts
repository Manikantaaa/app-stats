import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateAppStatsDto } from './dto/create-app-stat.dto';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AppStats } from './schemas/app-stats.schema';
import { UserApp } from 'src/userapps/schemas/userapp.schema';
import { App } from 'src/apps/schemas/app.schema';

@Injectable()
export class AppStatsService {
   constructor(
    @InjectModel(AppStats.name) private readonly appStatsModel: Model<AppStats>,
    @InjectModel(UserApp.name) private readonly userAppModel: Model<UserApp>,
    @InjectModel(App.name) private readonly appModel: Model<App>,
  ) {}

  async create(data: CreateAppStatsDto) {
    try {
      await this.appStatsModel.create({
        as_date: new Date(data.as_date),
        as_count: data.as_count,
        as_status: data.as_status ?? 1,
        as_ua_id: new Types.ObjectId(data.as_ua_id),
        as_ai_id: new Types.ObjectId(data.as_ai_id),
      });
      return { success: true, message: 'AppStats Created Successfully' };
    } catch (err) {
      throw new InternalServerErrorException('Failed to create AppStat');
    }
  }

  async findAll() {
    try {
      const records = await this.appStatsModel
        .find()
        .populate({
          path: 'as_ua_id',
          populate: {
            path: 'ua_app_id',
            select: 'app_name',
            model: this.appModel,
          },
        })
        .populate({
          path: 'as_ai_id',
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

  async findOne(id: string) {
      try {
      const record = await this.appStatsModel
        .findById(id)
        .populate({
          path: 'as_ua_id',
          populate: {
            path: 'ua_app_id',
            select: 'app_name',
            model: this.appModel,
          },
        })
        .populate({
          path: 'as_ai_id',
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
      console.error('FindOne AppStats Error:', error);
      throw error;
    }
  }

  async getStatsForApps(
    userId: string,
    appNames: string[],
    dateFilter: string,
    customDates: { from: string; to: string }
  ) {
    const results: { name: string; count: number }[] = [];
    const today = new Date();

    for (const appName of appNames) {
      const userApp = await this.userAppModel.findOne({ ua_u_id: userId })
        .populate({ 
          path: 'ua_app_id', 
          match: { app_name: appName } 
        });

      if (!userApp || !userApp.ua_app_id) continue;

      let dateWhere: any = {};
      switch (dateFilter) {
        case 'Today':
          dateWhere = { $gte: startOfDay(today), $lte: endOfDay(today) };
          break;
        case 'Yesterday':
          const yest = subDays(today, 1);
          dateWhere = { $gte: startOfDay(yest), $lte: endOfDay(yest) };
          break;
        case '1 week':
          const lastWeek = subWeeks(today, 1);
          dateWhere = { $gte: startOfDay(lastWeek), $lte: endOfDay(today) };
          break;
        case '1 month':
          const lastMonth = subMonths(today, 1);
          dateWhere = { $gte: startOfDay(lastMonth), $lte: endOfDay(today) };
          break;
        case 'Custom':
          if (customDates?.from && customDates?.to) {
            dateWhere = { $gte: new Date(customDates.from), $lte: new Date(customDates.to) };
          }
          break;
        default:
          continue;
      }

      const match = {
        as_ua_id: userApp._id,
        as_date: dateWhere,
      };

      const stat = await this.appStatsModel.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: "$as_count" }
          }
        }
      ]);

      results.push({
        name: appName,
        count: stat.length > 0 ? stat[0].total : 0,
      });
    }

    return results;
  }
}


