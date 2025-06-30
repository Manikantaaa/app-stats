import { Controller, Get, Post, Put, Delete, Body, Param, InternalServerErrorException, Patch } from '@nestjs/common';
import { UserAppsService } from './userapps.service';
import { UpdateUserAppDto } from './dto/update-user-app.dto';
import { CreateUserAppDto } from './dto/create-user-app.dto';

@Controller('user-apps')
export class UserAppsController {
  constructor(private readonly userAppsService: UserAppsService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.userAppsService.findAll();
      return {
        success: true,
        StatusCode: 200,
        message: 'Fetched all user apps successfully',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get("/visible-apps")
  async findVisible() {
    try {
      const data = await this.userAppsService.findVisible();
      return {
        success: true,
        StatusCode: 200,
        message: 'Fetched visible apps successfully',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    }
  @Post()
  async create(@Body() dto: CreateUserAppDto) {
   try {
      const result = await this.userAppsService.create(dto);
      return {
        success: true,
        StatusCode: 201,
        message: 'User apps created successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserAppDto) {
    try {
      const result = await this.userAppsService.update(id, dto);
      return {
        success: true,
        StatusCode: 200,
        message: 'User apps updated successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userAppsService.remove(id);
      return {
        success: true,
        StatusCode: 200,
        message: 'User app deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
