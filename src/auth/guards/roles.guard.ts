/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';
import getConfig from '../../config/configuration'
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Permission } from './constants/permission';
import { PermissionDocument, Permission as PermissionSchema} from '../../permission/schema/permission.schema';
import { Rol, RolDocument } from 'src/rol/schema/rol.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(PermissionSchema.name) private readonly permissionModel: Model<PermissionDocument>,
    @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No autorizado, no existe token');
    }
        
    const secrets = [
      getConfig().token_secret_login,
      getConfig().token_secret_use_main,
    ]
    let payload
    
    try {
      for(const secret of secrets){
        try {
          payload = this.jwtService.verify(token, {secret})
          break;
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            throw new UnauthorizedException('Token expirado');
          }
        }
      }
      const roleIds = payload.roles.map(role => role._id);
      if(!roleIds){
        throw new HttpException('No tiene los permisos', 403);
      }

      let hasRequiredPermissions = true;
      for (const roleId of roleIds) {
        const findRole = await this.rolModel.findById(roleId).exec();

        if (findRole) {
          const rolePermissions = findRole.permissionName;
          if(rolePermissions.length === 0){
            hasRequiredPermissions = false
          }
          for(const rolePermission of rolePermissions){
            const findPermission = await this.permissionModel.findById(rolePermission).exec();
            
            if(findPermission){

              const hasAllPermissions = requiredPermissions.every(permission => findPermission.permissionName.includes(permission));
              if (hasAllPermissions) {
                hasRequiredPermissions = true
                return true;
              } else {
                hasRequiredPermissions = false
              }  
            }else{
              hasRequiredPermissions = false
            }
          }
        }else{
          hasRequiredPermissions = false
        }
      }
      
      if (!hasRequiredPermissions) {
        throw new HttpException('El rol no tiene los permisos requeridos', 403);
      }
      const id = payload.id ? payload.id : payload.idUser;
  
      const findUser = await this.userModel.findOne({_id:id})
    
      if(!findUser){
          throw new HttpException('no tiene acceso',403)
        }

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      }
      if(error instanceof HttpException){
        throw error
      }
  
      throw new UnauthorizedException('token invalido')
    }

  return true
  }

  private extractTokenFromHeader(request: Request & { headers: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
