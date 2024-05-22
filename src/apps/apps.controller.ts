/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Res, ValidationPipe, UsePipes, Query } from '@nestjs/common';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-system.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Response } from 'express';
import { Permission } from 'src/auth/guards/constants/permission';
import { Permissions } from 'src/auth/guards/decorators/permissions.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AppPaginationDto } from 'src/common/dto/appPagination.dto';

@ApiTags('app')
@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  
  @Get()
  async findAll(@Query()appPaginationDto:AppPaginationDto) {
    return await this.appsService.findAll(appPaginationDto);
  }

  @Get(':id')
  async getAppById(@Param('id') id:string) {
    return await this.appsService.findOne(id);
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_CREAR_APP) 
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createApp (@Body() appObject:CreateAppDto){
    return await this.appsService.createNewApp(appObject)
  }


  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_EDITAR_APP) 
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Put('/update-app:id')
  async updateApp(@Param('id') id:string, @Body() appNewObject: CreateAppDto){
    return await this.appsService.updatedApp(id,appNewObject)
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ELIMINAR_APP) 
  @UseGuards(RolesGuard)
  @Delete('/delete-app:id')
  async deleteApp(@Param('id') id:string, @Res() res: Response){
    await this.appsService.removeApp(id)
    res.status(200).send('aplicacion eliminada')
  }
  
  
  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_RESTABLECER_APP) 
  @UseGuards(RolesGuard)
  @Put('/restart-app:id')
  async restartApp(@Param('id') id:string, @Res() res: Response){
    await this.appsService.restartApplication(id)
    res.status(200).send('aplicacion restablecida')
  }
}
