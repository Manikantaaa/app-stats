import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get active users
  async getUsers() {
    return this.prisma.user.findMany({
      where: { u_status: { not: 2 } }, 
      orderBy: { u_created_at: 'desc' },
      select: {
        u_id: true,
        u_firstname: true,
        u_lastname: true,
        u_email: true,
        u_status: true,
      },
    });
  }

  async addUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    status: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        u_firstname: data.firstname,
        u_lastname: data.lastname,
        u_email: data.email,
        u_password: hashedPassword,
        u_status: parseInt(data.status),
      },
    });
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
