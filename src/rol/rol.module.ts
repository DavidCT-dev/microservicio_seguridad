/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/rol.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Permission, PermissionSchema } from 'src/permission/schema/permission.schema';

@Module({
  imports:[MongooseModule.forFeature([
      { name:Rol.name, schema:RolSchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RolController],
  providers: [RolService]
})
export class RolModule {}
