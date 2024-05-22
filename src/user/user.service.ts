/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { SetPasswordUserDto } from './dto/set-password-user.dto';
import { hash } from 'bcrypt';
import { TokenHandlerService } from 'src/auth/token.handler.service';
import { App, AppDocument } from 'src/apps/schema/apps.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreateAppDto } from 'src/apps/dto/create-system.dto';
import { CreateRolDto } from 'src/rol/dto/create.rol.dto';
import { Rol, RolDocument } from 'src/rol/schema/rol.schema';
import { HttpService } from '@nestjs/axios';
import getConfig from '../config/configuration';
import { UpdateAppDto } from './dto/update-user.dto';
import axios, { all } from 'axios';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolUserDto } from './dto/rol-user.dto';
import { FilterDto } from './dto/user.pagination.dto';
import { SendEmailUserDto } from './dto/send-email-user.dto';

import { transporter } from 'src/main';
import { SetNewPasswordUserDto } from './dto/set-new-password-user.dto';
import { async } from 'rxjs';
@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
    @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
    private readonly tokenHandlerService: TokenHandlerService,
    private httpService:HttpService
  ){}

  async setAppDefault(): Promise<void> {
    const centralApp = await this.appModel.findOne({ name: 'central' }).exec();
  
    const users = await this.userModel.find({}).exec();
    for (const user of users) {
      if (!user.app || user.app.length === 0) {
        user.app = [centralApp?.uuid.toString()];
        await user.save();
      }
    }
  }


  async setRolDefault(): Promise<void> {
    const rol = await this.rolModel.findOne({ rolName: 'USER' }).exec();
  
    const users = await this.userModel.find({}).exec();
    for (const user of users) {
      if (!user.roles || user.roles.length === 0) {
        user.roles = [rol?._id.toString()];
        await user.save();
      }
    }
  }



  async getAllUsers(filterDto: FilterDto) {
    const { name, lastName, fullName, ci, email, nationality,
      phone, address, isActive, limit = 50,
      page = 1 } = filterDto;
    try {
     const data:any =  await this.tokenHandlerService.getUsersFromPersonal({name,lastName,fullName,ci,email,nationality,phone,address,isActive,limit,page});
     console.log("data :",data)
     console.log("total",data.total)
     const getApiPersonal = []

     for(const id of data.data){
      const res = await this.httpService.get(`${getConfig().api_personal}api/personal/${id}`).toPromise()
      getApiPersonal.push(res.data)
     }


     const combinedData=[]
    //  getApiPersonal.map(user=>{
    //   const users=await this.userModel.findOne({_id:user._id})
    //  })
     getApiPersonal.forEach(async(users) => {
      const user:any=await this.userModel.findOne({ _id: users._id })
      console.log("user",user)
        combinedData.push({
        id: users._id,
        email: users.email,
        password: user.password,
        roles:user.roles,
        app:user.app,
        name: users.name,
        lastname: users.lastName,
        gender:users.gender,
        ci: users.ci,
        phone: users.phone,
        address:users.address,
        nationality:users.nationality,
        unity:users.unity,
        charge:users.charge,
        schedule:users.schedule,
        level:users.level,
        file:users.file,
        isActive:users.isActive,
        isLocked:user.isLocked,
        lockedUntil:user.lockedUntil
      })
     });
    //  const allDataPersonal = await this.userModel.find()
    //  const combinedData = getApiPersonal.map((users, index) => ({
    //   id: users._id,
    //   email: users.email,
    //   password: user.password,
    //   roles:user.roles,
    //   app:user.app,
    //   name: users.name,
    //   lastname: users.lastName,
    //   gender:users.gender,
    //   ci: users.ci,
    //   phone: users.phone,
    //   address:users.address,
    //   nationality:users.nationality,
    //   unity:users.unity,
    //   charge:users.charge,
    //   schedule:users.schedule,
    //   level:users.level,
    //   file:users.file,
    //   isActive:users.isActive,
    //   isLocked:user.isLocked,
    //     lockedUntil:user.lockedUntil
    // }));

     await this.setAppDefault();
     await this.setRolDefault();
     console.log("total",data.total)
       return {
        data:combinedData,
        total:data.total
       }
    } catch (error) {
      console.log(error);
    }
  }

  async setPassword(_id:string, password:SetPasswordUserDto){
    
    const findUser = await this.userModel.findOne({_id})
    if (!findUser){
      throw new HttpException('Usuario no encontrado', 404);
    }
  
    const plainToHash = await hash(password.password, 10);
    console.log(_id," ",password);
    findUser.password = plainToHash
    
    return findUser.save()
  }

  async SendEmailPasswordToUser(email:SendEmailUserDto){
    const mailOptions = {
      from: 'studiosspero@gmail.com', // Debe coincidir con el correo configurado en el transporter
      to:email.to,
      subject:email.subject,
      text:email.text,
      html:`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${email.subject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            text-align: center;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #007bff;
          }
      
          p {
            font-size: 18px;
          }
      
          .password {
            background-color: #28a745;
            color: #fff;
            font-size: 24px;
            padding: 10px;
            border-radius: 6px;
            margin: 20px 0;
            text-align:center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nueva Contraseña</h1>
          <p>¡Hola!</p>
          <p>Tu nueva contraseña es:</p>
          <div class="password">${email.text}</div>
          <p>Guarda esta contraseña en un lugar seguro y no la olvides, en caso de olvidar nuevamente tu contraseña deberas solicitar una nueva contraseña</p>
          <p>Gracias</p>
          <p>ATT: Ingenieria de Sistemas-Fundacion</p>
        </div>
      </body>
      </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return 'Email enviado con éxito';
    } catch (error) {
      throw new Error(`Error al enviar el correo: ${error}`);
    }
  }

  async SetNewPasswordUser(email:SetNewPasswordUserDto){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const passwordLength = 12 // Longitud de la contraseña
    let randomPassword = ''

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomPassword += characters.charAt(randomIndex)
    }
    console.log("email: ",email.email)
    const res = await this.httpService.get(`${getConfig().api_personal}api/personal/filtered?email=${email.email}`).toPromise()
    console.log("user personal: ",res.data.data)
    // const findUser = await this.userModel.findOne({email:email.email})
    // if (!findUser){
    //   throw new HttpException('Usuario no encontrado', 404);
    // }
    if(res.data.data.length>0){
      const user=await this.userModel.findOne({_id:res.data.data[0]._id})
    if(user.password===null){
      throw new HttpException('comuniquese con administracion', 404);
    }
    const plainToHash = await hash(randomPassword, 10);
    user.password = plainToHash
    user.save()

    const mailOptions = {
      from: 'studiosspero@gmail.com', // Debe coincidir con el correo configurado en el transporter
      to:email.email,
      subject:"nuevo correo",
      text:randomPassword,
      html:`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Contraseña</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            text-align: center;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #007bff;
          }
      
          p {
            font-size: 18px;
          }
      
          .password {
            background-color: #28a745;
            color: #fff;
            font-size: 24px;
            padding: 10px;
            border-radius: 6px;
            margin: 20px 0;
            text-align:center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nueva Contraseña</h1>
          <p>¡Hola!</p>
          <p>Tu nueva contraseña es:</p>
          <div class="password">${randomPassword}</div>
          <p>Guarda esta contraseña en un lugar seguro y no la olvides, en caso de olvidar nuevamente tu contraseña deberas solicitar una nueva contraseña</p>
          <p>Gracias</p>
          <p>ATT: Ingenieria de Sistemas-Fundacion</p>
        </div>
      </body>
      </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return 'Email enviado con éxito';
    } catch (error) {
      throw new Error(`Error al enviar el correo: ${error}`);
    }
    }
    else{
      throw new HttpException('Usuario no encontrado', 404);
    }

    
  }
  async setUserApp(_id :string, appusersect:UpdateAppDto){
    const user = await this.userModel.findOne({_id}) 

    if(!user){
      throw new NotFoundException('usuario no encontrado');
    }

    const { name } = appusersect;
    const app = await this.appModel.findOne({name:name.toLocaleLowerCase()})
    
    if(!app){
      throw new NotFoundException('la aplicacion no existe');
    }

    if( app.isDeleted === true ){
      throw new NotFoundException('la aplicacion esta eliminada');
    }
    user.app.push(app.uuid.toString())
    return user.save();
  }


  async setUserRol(_id :string, rolusersect:CreateRolDto){
    const user = await this.userModel.findOne({_id}) 
    if(!user){
      throw new NotFoundException('usuario no encontrado');
    }

    const { rolName } = rolusersect;
    const rol = await this.rolModel.findOne({rolName})

    if(!rol){
      throw new NotFoundException('rol no encontrado');
    }

    user.roles.push(rol._id.toString())
    return user.save();
  }

  async removeUserRol(_id:string, rolId:RolUserDto){
    try{
      const user = await this.userModel.findOne({_id}) 

      if(!user){
        throw new NotFoundException('usuario no encontrado');
      }

      user.roles=user.roles.filter(userRole=>userRole.toString()!==rolId.rolId)
      
      user.save()
      return 'Rol elimado con exito'
    }catch(error)
    {
      return 'Error al eliminar el rol'
    }
  }
  async BlockUser(id:string){
    try{
      console.log("id: ",id)
      const user:any=await this.userModel.findOne({ _id:id })
      console.log("user: ",user.isLocked)
      const lockTime = 100;
      user.isLocked = true;
      user.lockedUntil = new Date(Date.now() + lockTime * 60 * 1000);
      console.log("user block: ",user.isLocked)
      user.save()
      return 'Usuario bloqueado con exito'
    }catch{
      throw new NotFoundException('ocurrio un error al intentar bloquear al usuario');
    }
    
  }

  async UnblockUser(id:string){
    try{
      console.log("id: ",id)
      const user:any=await this.userModel.findOne({ _id:id })
      console.log("user: ",user.isLocked)
      user.isLocked = false;
      user.save()
      return 'Usuario desbloqueado con exito'
    }catch{
      throw new NotFoundException('ocurrio un error al intentar desbloquear al usuario');
    }
    
  }
  async GetUserId(id:string):Promise<any>{
    try{
      const data:any =  await this.tokenHandlerService.getUserPersonalId(id);
      console.log("personal ID data:" ,data)
      const allDataPersonal = await this.userModel.findOne({ _id: data._id });
      if (!allDataPersonal) {
        throw new Error('No se encontraron datos personales para este usuario.');
      }
      const combinedData={
        id: data._id,
        password: allDataPersonal.password,
        roles:allDataPersonal.roles,
        app:allDataPersonal.app,
        name: data.name,
        lastname: data.lastName,
        gender:data.gender,
        level:data.level,
        ci: data.ci,
        email: data.email,
        phone: data.phone,
        address:data.address,
        nationality:data.nationality,
        unity:data.unity,
        charge:data.charge,
        schedule:data.schedule,
        file:data.file,
        isActive:data.isActive,
        isLocked:allDataPersonal.isLocked,
        lockedUntil:allDataPersonal.lockedUntil
      }
      return combinedData
      // console.log(`${getConfig().api_personal}api/personal/${id}`)
      // const response=await axios.get(`${getConfig().api_personal}api/personal/${id}`);
      // return response.data
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }
  async GetUserSchedule(id:string):Promise<any>{
    console.log(id);
    try{
      let userData={
        name:"",
        lastName:"",
        schedule:"",
      };
      console.log(`${getConfig().api_personal}api/personal/${id}`)
      const response=await axios.get(`${getConfig().api_personal}api/personal/${id}`);
      userData={
        name:response.data.name,
        lastName:response.data.lastName,
        schedule:response.data.schedule,
      }
      // // return userSchedule;
      try{
        console.log(`${getConfig().api_personal}api/schedule/${userData.schedule}`)
        const response=await axios.get(`${getConfig().api_personal}api/schedule/${userData.schedule}`);
        return response.data;
      }catch(error){
        throw new Error("no se puede obtener informacion de la api"+error);
      }
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }
  async GetScheduleId(id:string):Promise<any>{
    console.log(id)
    try{
      const response=await axios.get(`${process.env.api_personal}api/schedule/${id}`);
      console.log(response.data)
      return response.data;
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }
  async GetAttendanceId(id:string):Promise<any>{
    try{
      console.log(`${process.env.api_personal}api/attendance/${id}`)
      const response=await axios.get(`${process.env.api_personal}api/attendance/${id}`);
      console.log(response.data)
      return response.data;
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }
  async GetUserDocument(id:string,token:string):Promise<any>{
    console.log(id,token)
    const axiosInstace = axios.create({
      baseURL:getConfig().api_gestion_documental,
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    try{
      // const response=await axios.post(`${getConfig().api_gestion_documental}documents/get-documents-user/${id}`,config);
      const response=await axiosInstace.get(`documents/get-documents-user/${id}`)
      console.log(response)
      return response.data;
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }
  async GetUserAsset(id:string):Promise<any>{
    try{
      console.log(`${process.env.API_ACTIVOS}delivery/get-asset-from-personal/${id}`)
      const response=await axios.get(`${process.env.API_ACTIVOS}delivery/get-asset-from-personal/${id}`);
      console.log(response.data)
      return response.data;
    }catch(error){
      throw new Error("no se puede obtener informacion de la api"+error);
    }
  }

  async SetAllUserRol():Promise<any>{
    console.log("SetAllUser")
    const users=await this.userModel.find()
    console.log("users", users)
    users.map(user=>{
      const plainToHash = hash("1234567c", 10);
      user.password = plainToHash
      user.roles.push("655e52cb3586cbb781bd5d05")
      user.app.push("c46788b1-5092-440d-9c69-089609c639ed")
      user.app.push("19554e71-c763-4626-b436-86780b1246d9")
      user.app.push("491f9e4d-389b-4833-b8cb-1ff75544d34e")
      user.app.push("289f9caa-adab-4a47-9244-ddf080ec242b")
      user.app.push("a028ecbf-ab65-4f39-b541-25a274493d6f")
      user.save()
    })
    return 'usuarios asignados con todo'
  }
}








