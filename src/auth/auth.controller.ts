/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidateLoginMiddleware } from './middleware/validate-login.middleware';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import getConfig from '../config/configuration';
import { TokenExpiredError } from 'jsonwebtoken';
import { AppTokenDto } from './dto/app.token';
import { DecodedTokenDto } from './dto/decoded.token';
import { HttpService } from '@nestjs/axios';
import { LoginToAppDto } from './dto/login.app.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService,
    private httpService:HttpService
  ) {}

  @Post('login')
  @UsePipes(ValidateLoginMiddleware)
  async loginUser(
    @Body() userObjectLogin: LoginAuthDto, @Res() res:Response, @Req() req:Request,
  ) {
    const data = await this.authService.Login(userObjectLogin);
    res.send({
      message: 'Logged in successfully',
      apps: data.apps,
      tokenLogin: data.token
    });
  }


  @Post('login-app')
  async loginUserToApp(
    @Body() TokenObjectLoginToApp: LoginToAppDto, @Res() res:Response, @Req() req:Request,
  ) {
    console.log("login-app")
    const { token, appUuid } = TokenObjectLoginToApp;
    try {
      const decodedToken = this.jwtService.verify(token, {secret:getConfig().token_secret_login})
      const tokenMain = await this.authService.tokenLoginApp(decodedToken.id,appUuid)
      console.log('ingresa 3')
      res.send(tokenMain)

    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Token inválido', 401);
    }
  }


  
  @Post('decoded')
  async decodedToken(@Body() appToken: DecodedTokenDto, @Res() res:Response) {
    try {
      const { token } = appToken
      const secrets = [
        getConfig().token_secret_login,
        getConfig().token_secret_use_main,
      ]

      let decodedToken;
      for(const secret of secrets){
        try {
          decodedToken = this.jwtService.verify(token, {secret})
          break;
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            throw new UnauthorizedException('Token expirado');
          }
        }
      }
      if (!decodedToken) {
        throw new HttpException('Token inválido', 401);
      }
      res.send(decodedToken);
    } catch (error) {
      throw new HttpException('Token inválido', 401);
    }
  }

  

  @Post('verify-app-token')
  async appToken(@Body() tokenObject:AppTokenDto, @Res() res:Response, @Req() req:Request ) {
    const { app, token} = tokenObject
    let decodedToken
    
    try {
      decodedToken= await this.jwtService.verify(token, {secret: getConfig().token_secret_use_main})
      if (!decodedToken) {
        throw new HttpException('Token inválido', 401);
      }
      await this.authService.checkApps(app,decodedToken.idUser)
  
      // console.log(req)
      res.send(token);

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      } else if(error instanceof HttpException){
        throw error
      }
      throw new HttpException('Token inválido', 401);
    } 
  }
}
