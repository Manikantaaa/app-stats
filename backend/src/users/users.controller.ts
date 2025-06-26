import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get("users-list")
  getAllUsers() {
    return this.userService.getUsers();
  }
@Get("role")
getRole(@Query("email") email: string) {
  return this.userService.getRoleByEmail(email);
}

@Post("login")
async login(@Body() body: { email: string; password: string }) {
  return this.userService.login(body);
}

  @Post("add-user")
  async addUser(@Body() body: any) {
    return this.userService.addUser(body);
  }

  @Put("update-user/:id")
  async updateUser(@Param("id") id: string, @Body() body: any) {
    return this.userService.updateUser(Number(id), body);
  }

  @Put("toggle-user-status/:id")
  async toggleStatus(@Param("id") id: string, @Body() body: { u_status: number }) {
    return this.userService.toggleUserStatus(Number(id), body.u_status);
  }

  @Delete("delete-user/:id")
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(Number(id));
  }
}
