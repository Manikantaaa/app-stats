import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserAppsService } from './userapps.service';
import { UpdateUserAppDto } from './dto/update-user-app.dto';
import { CreateUserAppDto } from './dto/create-user-app.dto';

@Controller('user-apps')
export class UserAppsController {
  constructor(private svc: UserAppsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserAppDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserAppDto) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
