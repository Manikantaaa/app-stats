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
 async findVisible() {
    return this.prisma.app.findMany({
      where: { app_status: 1 },
      
      orderBy: {app_name: 'asc' },
    });
  }
  async create({ userId, appIds }: CreateUserAppDto) {
          await this.prisma.userApp.deleteMany({ where: { ua_u_id: userId } });
    const creations = appIds.map(appId => ({
      ua_u_id: userId,
      ua_app_id: appId,
      ua_status: 1,
    }));
    return this.prisma.userApp.createMany({ data: creations });
  }

async update(userId: number, { appIds }: UpdateUserAppDto) {
  if (!appIds) return;

  // Step 1: Fetch current assignments for this user
  const currentAssignments = await this.prisma.userApp.findMany({
    where: { ua_u_id: userId },
    select: { ua_app_id: true },
  });

  const currentAppIds = currentAssignments.map(ua => ua.ua_app_id);

  // Step 2: Determine new apps to insert
  const appsToAdd = appIds.filter(appId => !currentAppIds.includes(appId));

  // Step 3: Determine apps to remove
  const appsToRemove = currentAppIds.filter(appId => !appIds.includes(appId));

  // Step 4: Add new apps
  if (appsToAdd.length > 0) {
    const creations = appsToAdd.map(appId => ({
      ua_u_id: userId,
      ua_app_id: appId,
      ua_status: 1,
    }));
    await this.prisma.userApp.createMany({ data: creations });
  }

  // Step 5: Delete removed apps
  if (appsToRemove.length > 0) {
    await this.prisma.userApp.deleteMany({
      where: {
        ua_u_id: userId,
        ua_app_id: { in: appsToRemove },
      },
    });
  }

  return { message: 'User apps updated successfully' };
}


  // async remove(id: number) {
  //   return this.prisma.userApp.delete({ where: { ua_id: id } });
  // }
}
