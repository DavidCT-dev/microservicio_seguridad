/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { TokenHandlerService } from 'src/auth/token.handler.service';
import { HttpModule } from '@nestjs/axios';
import { App, AppSchema } from 'src/apps/schema/apps.schema';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';
import { Permission, PermissionSchema } from 'src/permission/schema/permission.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: App.name, schema: AppSchema },
      { name: Rol.name, schema: RolSchema },
      { name:Permission.name, schema:PermissionSchema }
    ]),
    HttpModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    TokenHandlerService,
  ],
})
export class UserModule {}
