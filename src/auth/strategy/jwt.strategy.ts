import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import getConfig from '../../config/configuration'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ingnoreExpiration:false,
      secretOrKey: getConfig().token_secret_login
    });
  }
  
  async validate(payload: any){
     
    return { 
      userId: payload.id,
      roles: payload.roles,    
      fullName: payload.fullName,
      ci: payload.ci, 
      userName: payload.userName,
    }
  }
}