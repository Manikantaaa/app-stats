import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppStatDto } from './dto/create-app-stat.dto';
import { UpdateAppStatDto } from './dto/update-app-stat.dto';
import { connect } from 'http2';

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
        const records = await this.prisma.appStats.findMany();
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

}
