/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolModule } from './rol/rol.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import getConfig from './config/configuration'
import { ValidateLoginMiddleware } from './auth/middleware/validate-login.middleware';
import { AppsModule } from './apps/apps.module';
import { ValidatePasswordMiddleware } from './auth/middleware/validate-password.middleware';
import { PermissionModule } from './permission/permission.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    MongooseModule.forRoot(
      getConfig().mongodb,
      {
        dbName:getConfig().db_name
      }),
    RolModule,
    ConfigModule.forRoot(
      {
        isGlobal:true,
        load: [configuration],
      }
    ),
    AppsModule,
    PermissionModule,
    CommonModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateLoginMiddleware)
      .forRoutes({path:'auth/login', method:RequestMethod.ALL} );

      consumer
      .apply(ValidatePasswordMiddleware)
      .forRoutes({path:'user/set-password-to-user/:id', method:RequestMethod.ALL} );
  }
}

