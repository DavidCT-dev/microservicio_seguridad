/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../user/schema/user.schema';

import getConfig from '../config/configuration'
import { HttpService } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';
import { App, AppDocument } from 'src/apps/schema/apps.schema';
import { FilterDto } from 'src/user/dto/user.pagination.dto';


@Injectable()
export class TokenHandlerService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtAuthService: JwtService,
    private readonly httpService: HttpService,
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>
  ) {}


  async generateTokenLogin(findUser, user){
    
    findUser = await this.userModel.findOne({_id:findUser._id}).populate('roles')
    const payloadLogin = { 
      id: findUser._id, 
      roles: findUser.roles, 
      ci:user.ci, 
      userName:user.email,
      password:user.password
    }
    
    const token = await this.jwtAuthService.signAsync(payloadLogin);
    
    await findUser.save();

    const data = {
      apps:findUser.app,
      token,
    };
    return data;
  }


  async generateTokenMain(findUser, app){
    
    const appDataToToken = await this.AppObject(app);
    
    const payloadMain = { 
      idUser: findUser._id, 
      App: {...appDataToToken},
      roles:findUser.roles,
      password:findUser.password
    };

    const token = await jwt.sign(
      payloadMain,getConfig().token_secret_use_main,
      {
        expiresIn: `${app.expiresIn}`
      }
    )
    return token
  } 


  async AppObject(findApp){
    if (!Array.isArray(findApp)) {
      findApp = [findApp];
    }
    return findApp.map(app => {
      let url = '';
        if (app.name == 'central') {
          url = getConfig().link_ip_central;
        }else if (app.name == 'personal') {
          url = getConfig().link_ip_personal;
        } else if (app.name == 'activo') {
          url = getConfig().link_ip_activo;
        } else if (app.name == 'gestion-documental') {
          url = getConfig().link_ip_gestion_documental;
        } else if (app.name == 'biblioteca') {
          url = getConfig().link_ip_biblioteca;
        }
      return {
        uuid: app.uuid.toString(),
        name: app.name,
        url:url
      };
    });
  }



  async getUsersFromPersonal(filterDto: FilterDto){
    try {
      console.log("getUserFromPersonal")

      const queryParams = {};

      if (filterDto.page) {
        queryParams['page'] = filterDto.page;
      }

      if (filterDto.limit) {
        queryParams['limit'] = filterDto.limit;
      }

      if (filterDto.isActive) {
        queryParams['isActive'] = filterDto.isActive;
      }

      if (filterDto.nationality) {
        queryParams['nationality'] = filterDto.nationality;
      }

      if (filterDto.address) {
        queryParams['address'] = filterDto.address;
      }

      if (filterDto.phone) {
        queryParams['phone'] = filterDto.phone;
      }

      if (filterDto.email) {
        queryParams['email'] = filterDto.email;
      }

      if (filterDto.ci) {
        queryParams['ci'] = filterDto.ci;
      }

      if (filterDto.fullName) {
        queryParams['fullName'] = filterDto.fullName;
      }

      if (filterDto.lastName) {
        queryParams['lastName'] = filterDto.lastName;
      }

      if (filterDto.name) {
        queryParams['name'] = filterDto.name;
      }
      const queryString = Object.keys(queryParams)
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');
      //&isActive=${isActive}&nationality=${nationality}$address=${address}&phone=${phone}$email=${email}&ci=${ci}&fullName=${fullName}&lastName=${lastName}&name=${name}
        const res = await this.httpService.get(`${getConfig().api_personal}api/personal/filtered?${queryString}`).toPromise();
        // const res = await this.httpService.get('https://8aaa8e9763be26.lhr.life/api/personal/filtered').toPromise();
        console.log("token personal",res)

        console.log("res",res.data.data)

        const userIds = res.data.data.map(user => user._id)
        const users=res.data.data
        for (const user of users) {
          const existingUser = await this.userModel.findOne({ _id: user._id });
          if (!existingUser) {
            await this.userModel.create({ _id: user._id });
          }
        }

        return {
          data:userIds,
          total:res.data.total
        }; 
    } catch (error) {
      return [];
    }
  }
  async getUserPersonalId(id:string){
    try {
      console.log("get personal id: ",id)
        const res = await this.httpService.get(`${getConfig().api_personal}api/personal/${id}`).toPromise();
        console.log("personal ID:  ",res.data)
        const userId = res.data
        console.log("res data: ",userId)
        const existingUser = await this.userModel.findOne({ _id: userId });
          if (!existingUser) {
            await this.userModel.create({ _id: userId});
          }
          // else{
          //   if(userId.email!=existingUser.email){
          //     existingUser.email=userId.email
          //     existingUser.save()
          //   }
          //   if(userId.ci!=existingUser.ci){
          //     existingUser.ci=userId.ci
          //     existingUser.save()
          //   }
          // }
        console.log("last Checked: ",userId)
        return userId
    } catch (error) {
      return [];
    }
  }

  
  async getPeopleAccounts(email:string){
    try {
      let res
      if(email.includes("@")){
        res = await this.httpService.get(`${getConfig().api_personal}api/personal/filtered?email=${email}`).toPromise()
      }
      else{
        res = await this.httpService.get(`${getConfig().api_personal}api/personal/filtered?ci=${email}`).toPromise()
      }
      // console.log("id central: ",res.data.data)
      // const user=await this.userModel.findOne({_id:res.data.data._id})
      // console.log("user central: ",user)

      console.log("getPeopleAccounts: ",res.data.data)
      return res.data.data 
    } catch (error) {
      throw error.response?.data
    }
  }
}
