/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create.rol.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SetPermissionToRolDto } from './dto/permission.rol';
import { Permission } from 'src/auth/guards/constants/permission';
import { Permissions } from 'src/auth/guards/decorators/permissions.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PermissionRolDto } from './dto/permission.rol.dto';
import { DeleteRolDto } from './dto/delete.rol.dto';

@ApiTags('rol')
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}
  
  @Get()
  async getRols(@Query()paginationDto:PaginationDto){
    return await this.rolService.showAllRols(paginationDto);
  }

  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  @Get(':id')
  async getRol(@Param('id') id :string){
    return await this.rolService.getRolById(id)
  }
  
  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_CREAR_ROL) 
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createRol(@Body() rolObject :CreateRolDto){
    rolObject.rolName= rolObject.rolName.toUpperCase()
    return await this.rolService.createNewRol(rolObject)
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_EDITAR_ROL) 
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateRol(@Param('id') id :string, @Body() rolObject:CreateRolDto){
    rolObject.rolName=rolObject.rolName.toUpperCase()
    return await this.rolService.updatedRol(id, rolObject)
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ASIGNAR_PERMISO_ROL) 
  @UseGuards(RolesGuard)
  @Put('set-permission-to-rol/:id')
  async setPermissionToRol(@Param('id') id :string, @Body() setPermissionObject:SetPermissionToRolDto){
    return await this.rolService.setPermission(id, setPermissionObject)
  }
  @ApiBearerAuth()
  // @Permissions(Permission.CENTRAL_ELIMINAR_PERMISO_ROL) 
  @UseGuards(RolesGuard)
  @Put('delete-permission-to-rol/:id')
  async deletePermissionToRol(@Param('id') id :string, @Body() permissionId:PermissionRolDto){
    return await this.rolService.deletePermission(id,permissionId)
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ELIMINAR_ROL) 
  @UseGuards(RolesGuard)
  @Post('delete-rol')
  async removeRol(@Body()id:DeleteRolDto){
    console.log("Put delete rol")
    return await this.rolService.deleteRol(id)
  }
  @Post(':number')
  createRandomData(@Param('number')number:number){
    this.rolService.createRandomData(number);
    return {message:'se crearon ${number} registros aleatorios'}
  }
}
