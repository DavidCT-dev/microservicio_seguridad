/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rol, RolDocument } from './schema/rol.schema';
import { Model } from 'mongoose';
import { CreateRolDto } from './dto/create.rol.dto';
import { SetPermissionToRolDto } from './dto/permission.rol';
import { Permission, PermissionDocument } from 'src/permission/schema/permission.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { faker, ro } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { PermissionRolDto } from './dto/permission.rol.dto';
import { DeleteRolDto } from './dto/delete.rol.dto';
@Injectable()
export class RolService {
  constructor(
    @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ) { }

  async setRolesDefault() {
    const count = await this.rolModel.estimatedDocumentCount();
    if (count > 0) return;
    console.log("creando roles por defecto")
    const values = await Promise.all([
      this.rolModel.create({ rolName: 'USER' ,aplicattion:'prueba'},),
      this.rolModel.create({ rolName: 'ADMIN' ,aplicattion:'prueba'}),
      this.rolModel.create({ rolName: 'SUPERADMIN' ,aplicattion:'prueba'})
    ]);
    console.log("roles por defecto creados")

    const sa=await this.rolModel.findOne({rolName:'SUPERADMIN'})

    
    const permissions = await this.permissionModel.find();
    
   permissions.map(permission=>{
    sa.permissionName.push(permission._id.toString());
   })
    
   sa.save()
    return values
  }

  async showAllRols(paginationDto: PaginationDto) {
    const { limit = 20, offset = 1, name } = paginationDto;
    console.log(limit, offset, name);

    // Obtén el número total de elementos sin aplicar límite ni desplazamiento
    const totalQuery = this.rolModel.find().populate('permissionName');
    
    if (name) {
      totalQuery.where({ rolName: { $regex: name, $options: 'i' } });
    }


    const countQuery=this.rolModel.find()
    const total = await countQuery.countDocuments();
    console.log("total ", total);

    const page = (offset - 1) * limit;
    const roles = await totalQuery
      .skip(page)
      .limit(limit)
      .select('-__v')
      .exec();

    return {
      data: roles,
      total,
    };
}

  async getRolById(id:string){
    return await this.rolModel.findById(id).populate('permissionName')
    
  }

  async createNewRol(rolObject:CreateRolDto){
    const rol=await this.rolModel.findOne({rolName:rolObject.rolName})
    if(!rol){
      rolObject.rolName=rolObject.rolName.toUpperCase()
      rolObject.aplicattion=rolObject.aplicattion.toUpperCase()
      return await this.rolModel.create(rolObject)
    }
    else{
      throw new HttpException('el rol ya existe',11100)
    }
  }

  async updatedRol(id:string, rolObject: CreateRolDto){
    return await this.rolModel.findByIdAndUpdate(id,rolObject,{new:true})
  } 
  
  async setPermission(id:string, setPermissionObject: SetPermissionToRolDto){
    const findRol = await this.rolModel.findById(id)
    if(!findRol){
      throw new HttpException('rol no encotrado',404)
    }
    const { permissionName } = setPermissionObject;
    
    const findPermission = await this.permissionModel.findOne({permissionName});
    
    if(!findPermission){
      throw new HttpException('permiso no encotrado',404)
    }
    
    if (!findRol.permissionName.includes(findPermission._id.toString())) {
      findRol.permissionName.push(findPermission._id.toString());
    } else {
      throw new HttpException('El permiso ya existe en el rol', 400);
    }
    
    return findRol.save()
  }
  async deletePermission(id:string,permissionId:PermissionRolDto){
    try{
      const rol = await this.rolModel.findById(id)
      if(!rol){
        throw new HttpException('rol no encotrado',404)
      }    
      rol.permissionName=rol.permissionName.filter(id=>id.toString()!==permissionId.permissionId)
      rol.save()
      return('Permiso eliminado con exito')
    }catch(error){
      return('Error al intentar eliminar el permiso')
    }
  }

  async deleteRol(id:DeleteRolDto){
    console.log("deleteRol");
    try {
      for (const rol of id.rolId) {
        const rolDoc = await this.rolModel.findById(rol);
  
        if (!rolDoc) {
          // Manejar el caso donde el rol no se encuentra
          console.error(`No se encontró el rol con ID ${rol}`);
          continue; // Continuar con el siguiente rol
        }
  
        rolDoc.isActive = false;
        await rolDoc.save();
      }
  
      return 'borrado con éxito';
    } catch (error) {
      // Manejar errores de manera apropiada
      console.error('Error al borrar roles:', error.message);
      throw new Error('Error al borrar roles');
    }
  }
  async createRandomData(cantidad:number){
    console.log(cantidad)
    // const number=cantidad;
    

    for (let i = 0; i < cantidad; i++) {
      const createRolDto: CreateRolDto = {
        rolName: faker.name.firstName(),
        aplicattion:faker.name.zodiacSign(),
        isActive:true
      };
      const newRol = new this.rolModel(createRolDto);
      newRol.save()
    }
  }
}
