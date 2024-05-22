/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/auth/guards/constants/permission';
import { Permissions } from 'src/auth/guards/decorators/permissions.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PermissionPaginationDto } from 'src/common/dto/permissionPagination.dto';
@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_CREAR_PERMISO) 
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll(@Query()permissionPaginationDto:PaginationDto) {
    return this.permissionService.findAll(permissionPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_EDITAR_PERMISO) 
  @UseGuards(RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ELIMINAR_PERMISO) 
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Post(':number')
  createRandomData(@Param('number')number:number){
    this.permissionService.createRandomData(number);
    return {message:'se crearon ${number} registros aleatorios'}
  }
}
