import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('users-list')
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body);
  }

  @Post('verify')
  verify(@Body() body: { email: string }) {
    return this.userService.verify(body.email);
  }
  @Post('add-user')
  addUser(@Body() dto: CreateUserDto) {
    return this.userService.addUser(dto);
  }
  

  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Patch('toggle-user-status/:id')
  toggleUserStatus(@Param('id') id: string, @Body() body: { u_status: number }) {
    return this.userService.toggleUserStatus(id, body.u_status);
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
