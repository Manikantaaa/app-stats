import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppStatDto } from './dto/create-app-stat.dto';
import { UpdateAppStatDto } from './dto/update-app-stat.dto';

@Injectable()
export class AppStatsService {
    constructor(private prisma: PrismaService){}

    async create(data: CreateAppStatDto){
        try{
            await this.prisma.appStats.create({
                data:{
                    ...data,
                    as_date : new Date(data.as_date)
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
