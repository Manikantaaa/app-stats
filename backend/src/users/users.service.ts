import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getUsers() {
    return this.prisma.user.findMany({
      where: { u_status: { not: 2 } },
      orderBy: { u_created_at: 'desc' },
      select: {
        u_id: true,
        u_role: true,
        u_firstname: true,
        u_lastname: true,
        u_email: true,
        u_status: true,
      },
    });
  }
 async getRoleByEmail(email: string) {
  return this.prisma.user.findFirst({
    where: { u_email: email },
    select: {
      u_role: true,
    },
  });
}

async login(data: { email: string; password: string }) {
  const user = await this.prisma.user.findFirst({
    where: { u_email: data.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(data.password, user.u_password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }


  return {
    name: user.u_firstname + " " + user.u_lastname,
    email: user.u_email,
    role: user.u_role,
    
  };
}
  async addUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    status: string;
    role: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
         u_role: parseInt(data.role),
        u_firstname: data.firstname,
        u_lastname: data.lastname,
        u_email: data.email,
        u_password: hashedPassword,
        u_status: parseInt(data.status),
       
      },
    });
  }


async seedRolesIfNotExists() {
  const existingRoles = await this.prisma.userRole.findMany();
  if (existingRoles.length === 0) {
    await this.prisma.userRole.createMany({
      data: [
        { ur_id: 1, ur_role: 1 },
        { ur_id: 2, ur_role: 2 }, 
      ],
      skipDuplicates: true,
    });
    console.log("✅ Default roles seeded.");
  } else {
    console.log("✅ Roles already exist, skipping seed.");
  }
}

  // Update user (exclude password)
  async updateUser(id: number, data: {
    firstname: string;
    lastname: string;
    email: string;
    status: string;
  }) {
    return this.prisma.user.update({
      where: { u_id: id },
      data: {
        u_id: id,
        u_firstname: data.firstname,
        u_lastname: data.lastname,
        u_email: data.email,
        u_status: parseInt(data.status),
      },
    });
  }

  // Toggle user status (active/hidden)
  async toggleUserStatus(id: number, status: number) {
    return this.prisma.user.update({
      where: { u_id: id },
      data: { u_status: status },
    });
  }

  // Soft delete user
  async deleteUser(id: number) {
    return this.prisma.user.update({
      where: { u_id: id },
      data: { u_status: 2 },
    });
  }
}
