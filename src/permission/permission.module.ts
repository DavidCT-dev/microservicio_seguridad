/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schema/permission.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Permission.name, schema:PermissionSchema },
    { name:Rol.name, schema:RolSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
