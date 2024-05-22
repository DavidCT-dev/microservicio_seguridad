/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User, UserSchema } from '../user/schema/user.schema';
import getConfig from '../config/configuration'
import { ConfigModule } from '@nestjs/config';
import { TokenHandlerService } from './token.handler.service';
import { HttpModule } from '@nestjs/axios';
import { App, AppSchema } from 'src/apps/schema/apps.schema';
import { Permission, PermissionSchema } from 'src/permission/schema/permission.schema';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name:App.name, schema: AppSchema },
      { name:Permission.name, schema:PermissionSchema },
      { name:Rol.name, schema:RolSchema }
    ]),
    ConfigModule.forRoot({ load: [getConfig] }),
    JwtModule.register({
      global:true,
      secret: getConfig().token_secret_login,
      signOptions:{expiresIn: getConfig().token_expiration}, 
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenHandlerService, 
    JwtStrategy, 
    
  ]
})
export class AuthModule {}
