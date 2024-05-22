/* eslint-disable prettier/prettier */
import { Body, Controller, Get,Post, HttpException, Param, Put, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SetPasswordUserDto } from './dto/set-password-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateAppDto } from 'src/apps/dto/create-system.dto';
import { CreateRolDto } from 'src/rol/dto/create.rol.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Permission } from 'src/auth/guards/constants/permission';
import { Permissions } from 'src/auth/guards/decorators/permissions.decorator';
import { UpdateAppDto } from './dto/update-user.dto';
import { SetTokenUserDto } from './dto/token-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolUserDto } from './dto/rol-user.dto';
import { FilterDto } from './dto/user.pagination.dto';
import { SendEmailUserDto } from './dto/send-email-user.dto';

import { transporter } from 'src/main';
import { SetNewPasswordUserDto } from './dto/set-new-password-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Obtener registros por filtrado de parametros',
    description: 'Realiza la busqueda de registros por el filtrado'
  })
  @ApiQuery({ name: 'name', type: String,  required: false })
  @ApiQuery({ name: 'lastName', type: String,  required: false })
  @ApiQuery({ name: 'fullName', type: String,  required: false })
  @ApiQuery({ name: 'ci', type: String,  required: false })
  @ApiQuery({ name: 'email', type: String,  required: false })
  @ApiQuery({ name: 'phone', type: String,  required: false })
  @ApiQuery({ name: 'address', type: String,  required: false })
  @ApiQuery({ name: 'isActive', type: String,  required: false })
  @ApiQuery({ name: 'nationality', type: String,  required: false })
  @ApiQuery({ name: 'isActive', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @Get()
  async getUsers(@Query() filterDto: FilterDto) {
    console.log("nationality: ",filterDto.nationality)
    if(filterDto.nationality===undefined){
      filterDto.nationality='';
    }
    try {
      const data = await this.userService.getAllUsers(filterDto);

      for(const uuid of data.data){
        uuid.app
      }    
      return data
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
  }
  @Get("/:id")
  async getUserId(@Param('id')id:string){
    return await this.userService.GetUserId(id);
  }
  @Get("/user-schedule/:id")
  async getUserSchedule(@Param('id')id:string) {
    return await this.userService.GetUserSchedule(id);
  }
  @Get("/schedule/:id")
  async getScheduleId(@Param('id')id:string) {
    return await this.userService.GetScheduleId(id);
  }
  @Get("/user-attendance/:id")
  async getAttendanceId(@Param('id')id:string) {
    return await this.userService.GetAttendanceId(id);
  }
  @Post("/user-documents/:id")
  async getUserDocument(@Param('id')id:string,
  @Body() token:SetTokenUserDto) {
    return await this.userService.GetUserDocument(id,token.token);
  }
  @Get("/user-assets/:id")
  async getUserAsset(@Param('id')id:string) {
    return await this.userService.GetUserAsset(id);
  }

  // @ApiBearerAuth()
  // @Permissions(Permission.ASIGNAR_CONTRASEÑA_CEN) 
  // @UseGuards(RolesGuard)
  @Put('/set-password-to-user/:id')
  async setPasswordUser(
    @Param('id') id: string,
    @Body() password: SetPasswordUserDto,
  ) {
    try {
      return await this.userService.setPassword(id, password);      
    } catch (error) {
      console.log(error)
      if(error instanceof HttpException){
        throw error
      };
    }
  }
  @Post('/send-email-password-to-user')
  async SendEmailPassword(
    @Body() email: SendEmailUserDto,
  ) {
    return await this.userService.SendEmailPasswordToUser(email)
    
  }
  @Post('/send-new-password')
  async SetPasswordUser(@Body()email:SetNewPasswordUserDto){
    return await this.userService.SetNewPasswordUser(email)
  }

  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ASIGNAR_APLICACION) 
  @UseGuards(RolesGuard)
  @Put('set-app-to-user/:idUser')
  async setSystemUser(
    @Param('idUser') id: string,
    @Body() appObject: UpdateAppDto,
  ) {
    try {
      return await this.userService.setUserApp(id, appObject);
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
    
  }


  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_ASIGNAR_ROL) 
  @UseGuards(RolesGuard)
  @Put('set-rol-to-user/:idUser')
  async setRolUser(@Param('idUser') id: string, @Body() rolObject: CreateRolDto,
  ) {
    try {
      return await this.userService.setUserRol(id, rolObject);
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
  }


  @ApiBearerAuth()
  @Permissions(Permission.CENTRAL_REMOVER_ROL_USUARIO) 
  @UseGuards(RolesGuard)
  @Put('remove-rol-to-user/:idUser')
  async removeRolUser(@Param('idUser') id: string, @Body() rolId: RolUserDto
  ) {
    try {
          return await this.userService.removeUserRol(id, rolId);
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
  }

  // @ApiBearerAuth()
  // @Permissions(Permission.CENTRAL_REMOVER_ROL_USUARIO) 
  // @UseGuards(RolesGuard)
  @Post('block-user/:idUser')
  async blockUser(@Param('idUser') id: string
  ) {
    try {
      return await this.userService.BlockUser(id);
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
  }

  // @ApiBearerAuth()
  // @Permissions(Permission.CENTRAL_REMOVER_ROL_USUARIO) 
  // @UseGuards(RolesGuard)
  @Post('unblock-user/:idUser')
  async unblockUser(@Param('idUser') id: string
  ) {
    try {
      return await this.userService.UnblockUser(id);
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      };
    }
  }
  @Get('set-all-user-automatically')
  async SetAllUserData(){
    try{
      return await this.userService.SetAllUserRol()
    }catch(error){
      throw error
    }
  }
}
