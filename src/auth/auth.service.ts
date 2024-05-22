/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable,  UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,  } from 'mongoose';
import { compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login.auth.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { TokenHandlerService } from './token.handler.service';
import { App, AppDocument } from 'src/apps/schema/apps.schema';
import { LoginToAppDto } from './dto/login.app.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
    private tokenHandlerService: TokenHandlerService,
  ) { } 


  async Login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin
    console.log("email: ",email," password: ",password);

    const accountsPeople = await this.tokenHandlerService.getPeopleAccounts(email)
    console.log("accountPeople",accountsPeople._id)
    if(accountsPeople)
    {
      const user=await this.userModel.findOne({_id:accountsPeople[0]._id})
      console.log("user central: ",user)
      if (user.isLocked) {
        const time = user.lockedUntil.getTime() - Date.now();
        const timeSeconds = time / 100000;
        if(timeSeconds < 0) {
          await this.resetFailedLoginAttempts(user);
          user.save()
        }
        throw new HttpException(`Usuario bloqueado. intenta otra vez despues de ${timeSeconds} segundos`, 423)
      }
  
      if(!user.password){
        throw new HttpException('usuario sin contraseña',401);
      }
      const checkPassword = await compare(password, user.password);
  
      if (!checkPassword) {
        await this.incrementFailedLoginAttempts(user)
        await user.save();
        throw new UnauthorizedException('Credenciales invalidas');
      }

      if(!accountsPeople[0].isActive){
        throw new UnauthorizedException('El personal se encuentra deshabilitado');
      }
      return await this.tokenHandlerService.generateTokenLogin(user._id, user);
    }
    else{
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }  
  }


  async tokenLoginApp(id:string, app:string){
  
    const findUser = await this.userModel.findOne({_id:id})

    if(!findUser){
      throw new HttpException('usuario no encontrado',404)
    }

    const findApp = await this.appModel.findOne({uuid:app})
    
    if(!findApp){
      throw new HttpException('aplicacion no encontrada',404)
    }
    const tokenMain = await this.tokenHandlerService.generateTokenMain(findUser, findApp)
    return tokenMain
  }


  async checkApps(app, _id: string) {
    const findUser = await this.userModel.findOne({ _id });
    
    if(!findUser){
      throw new HttpException('el usuario no existe ',404);
    }
    const findApp = await this.appModel.findOne({ uuid : app})

    if(!findApp){
      throw new HttpException('aplicacion no encontrada ',404);
    }
    if(!findUser.app.includes(app)){
      throw new HttpException('no tiene acceso a la aplicacion',401);
    }  
    return true
  }


  async incrementFailedLoginAttempts(findUser) {
    const maxAttempts = 5;
    const lockTime = 1;
    findUser.failedLoginAttempts++;

    if (findUser.failedLoginAttempts >= maxAttempts) {
      findUser.isLocked = true;
      findUser.lockedUntil = new Date(Date.now() + lockTime * 60 * 1000);
    }
    return findUser;
  }

  async resetFailedLoginAttempts(findUser) {
    findUser.failedLoginAttempts = 0;
    findUser.isLocked = false;
    findUser.lockedUntil = null;
    return findUser;
  }

}
