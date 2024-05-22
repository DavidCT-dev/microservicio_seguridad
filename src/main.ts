/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import getConfig from './config/configuration'
import { AppsService } from './apps/apps.service';
import { RolService } from './rol/rol.service';
import { PermissionService } from './permission/permission.service';
import { ValidationPipe } from '@nestjs/common';


import { Transporter, createTransport } from 'nodemailer';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const rol = app.get(RolService)
  

  const apps = app.get(AppsService)
  apps.setAppsDefault()

  const permission = app.get(PermissionService)
  permission.setPermissionDefault()
  rol.setRolesDefault()

  

  const config = new DocumentBuilder()   
    .addBearerAuth()  
    .setTitle('API Documentation')
    .setDescription('API central')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addTag('rol')
    .addTag('permission')
    .addTag('app')
    .build();

  const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document,{
      explorer:true,
    });
  app.useGlobalPipes(
    new ValidationPipe({
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    })
  )
  await app.listen(getConfig().port);

  
}
const transporter: Transporter = createTransport({
  service: 'Gmail', // Cambia al servicio que estés utilizando
  auth: {
    user: 'studiosspero@gmail.com',
    pass: 'ssfh vhpa yabg mtnx',
  },
});

export { transporter };

bootstrap();
