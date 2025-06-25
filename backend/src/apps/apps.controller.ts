import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppsService } from './apps.service';

@Controller()
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get('apps-list')
  findAll() {
    return this.appsService.findAll();
  }

  @Post('add-app')
  create(@Body() body: { app_name: string }) {
    return this.appsService.createApp(body);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() body: { app_name: string }) {
    return this.appsService.updateApp(Number(id), body);
  }
  @Put('toggle-status/:id')
toggleStatus(@Param('id') id: string, @Body() body: { app_status: number }) {
  return this.appsService.toggleAppStatus(Number(id), body.app_status);
}


  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.appsService.deleteApp(Number(id));
  }
}