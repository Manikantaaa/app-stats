import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserAppDto } from './dto/update-user-app.dto';
import { CreateUserAppDto } from './dto/create-user-app.dto';

@Injectable()
export class UserAppsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.userApp.findMany({
      include: { user: true, app: true },
      orderBy: { ua_created_at: 'desc' },
    });
  }

  async create({ userId, appIds }: CreateUserAppDto) {
    const creations = appIds.map(appId => ({
      ua_u_id: userId,
      ua_app_id: appId,
      ua_status: 1,
    }));
    return this.prisma.userApp.createMany({ data: creations });
  }

  async update(id: number, { appIds, ua_status }: UpdateUserAppDto) {
    const existing = await this.prisma.userApp.findUnique({ where: { ua_id: id } });
    if (!existing) throw new Error('Not found');

    const data: any = {};
    if (ua_status !== undefined) data.ua_status = ua_status;
    if (appIds) {
      // delete old entries and create new ones
      await this.prisma.userApp.delete({ where: { ua_id: id } });
      return this.create({ userId: existing.ua_u_id, appIds });
    }

    return this.prisma.userApp.update({ where: { ua_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.userApp.delete({ where: { ua_id: id } });
  }
}
