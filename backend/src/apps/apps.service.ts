import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.app.findMany({
      where: { app_status: { not: 2 } },
      orderBy: { app_created_at: 'desc' },
    });
  }

  async createApp(data: { app_name: string }) {
    return this.prisma.app.create({
      data: {
        app_name: data.app_name,
        app_status: 1,
      },
    });
  }

  async updateApp(id: number, data: { app_name: string }) {
    return this.prisma.app.update({
      where: { app_id: id },
      data: {
        app_name: data.app_name,
      },
    });
  }
  async toggleAppStatus(id: number, status: number) {
    return this.prisma.app.update({
      where: { app_id: id },
      data: { app_status: status },
    });
  }

  async deleteApp(id: number) {
    return this.prisma.app.update({
      where: { app_id: id },
      data: { app_status: 2 },
    });
  }
}
