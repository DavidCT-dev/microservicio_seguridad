/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PermissionPaginationDto } from 'src/common/dto/permissionPagination.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ){}
  
  async setPermissionDefault() {
    const count = await this.permissionModel.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      this.permissionModel.create({ permissionName: 'CENTRAL_ESTABLECER_CONTRASEÑA_USUARIO' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ESTABLECER_APP_USUARIO' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ESTABLECER_ROL_USUARIO' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_REMOVER_ROL_USUARIO' }),

      this.permissionModel.create({ permissionName: 'CENTRAL_CREAR_ROL' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_EDITAR_ROL' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ESTABLECER_PERMISO_ROL' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ELIMINAR_ROL' }),
      
      this.permissionModel.create({ permissionName: 'CENTRAL_CREAR_PERMISO' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_EDITAR_PERMISO' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ELIMINAR_PERMISO' }),

      this.permissionModel.create({ permissionName: 'CENTRAL_CREAR_APP' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_EDITAR_APP' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_ELIMINAR_APP' }),
      this.permissionModel.create({ permissionName: 'CENTRAL_RESTABLECER_APP' }),


      //GESTION DOCUMENTAL

      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_REACTIVAR_DOCUMENTO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_TIPO_DOCUMENTACION_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_TIPOS_DOCUMENTACION_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_TIPOS_DOCUMENTACION_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_TIPOS_DOCUMENTACION_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_REACTIVAR_TIPOS_DOCUMENTACION_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_WORKFLOW_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_WORKFLOW_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_WORKFLOW_ONE_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_WORKFLOW_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_WORKFLOW_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_REACTIVAR_WORKFLOW_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_STEP_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_STEP_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_STEP_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_STEP_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_REACTIVAR_STEP_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_ROL_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_ROL_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_ROL_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_ROL_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_ROL_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_CREAR_PERMISO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_OBTENER_PERMISO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_EDITAR_PERMISO_DOC' }),
      this.permissionModel.create({ permissionName: 'GESTIONDOCUMENTAL_ELIMINAR_PERMISO_DOC' }),


      //biblioteca
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_CREAR_LIBRO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_ELIMINAR_LIBRO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_EDITAR_LIBRO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_AGREGAR_LIBRO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_CREAR_LIBRO_DIGITAL_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_ELIMINAR_LIBRO_DIGITAL_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_EDITAR_LIBRO_DIGITAL_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_OBTENER_LIBRO_DIGITAL_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_CREAR_PRESTAMO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_OBTENER_PRESTAMO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_EDITAR_PRESTAMO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_ELIMINAR_PRESTAMO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_CREAR_LECTOR_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_OBTENER_LECTOR_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_EDITAR_LECTOR_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_ELIMINAR_LECTOR_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_PROCESAR_DOC_OCR_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_VERIFICAR_PLAGIO_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_VER_RESULTADOS_LIB' }),
      this.permissionModel.create({ permissionName: 'BIBLIOTECA_CREAR_TESIS_LIB' }),

      //activo

      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_UFVS_DEL_BCB_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_UFVS_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_VISUALIZAR_BITACORAS_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_ACTIVO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_ACTIVOS_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_ACTIVO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_ACTIVO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_USUARIOS' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_GRUPO_CONTABLE_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_GRUPOS_CONTABLES_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_GRUPO_CONTABLE_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_GRUPO_CONTABLE_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_ENTREGA_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_ENTREGA_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_ENTREGA_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_ENTREGA_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_PROVEEDOR_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_ESTADO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_ESTADO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_ESTADO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_REESTRABLECER_ESTADO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_PROVEEDOR_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_PROVEEDORES_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_PROVEEDORES_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_PROVEEDOR_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_REESTABLECER_PROVEEDOR_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_PERMISO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_PERMISOS_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_PERMISO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_PERMISO_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_CREAR_DEVOLUCION_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_OBTENER_DEVOLUCION_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_EDITAR_DEVOLUCION_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_ELIMINAR_DEVOLUCION_ACT' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_VER_PDF' }),
      this.permissionModel.create({ permissionName: 'ACTIVO_VER_QR' }),
      

      //personal 
      this.permissionModel.create({ permissionName: 'PERSONAL_CREAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_EDITAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_INACTIVAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_ACTIVAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_FILTRAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_LISTAR_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_GENERAR_REPORTE_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_VER_PDF' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_GENERAR_KARDEX_PER' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_CREAR_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_EDITAR_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_INACTIVAR_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_ACTIVAR_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_OBTENER_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_FILTRAR_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_CREAR_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_EDITAR_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_INACTIVAR_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_ACTIVAR_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_OBTENER_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_FILTRAR_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_ASIGNAR_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_EDITAR_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_INACTIVAR_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_ACTIVAR_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_OBTENER_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_FILTRAR_LIC' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_VER_ASISTENCIA' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_MARCAR_ASISTENCIA' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_PERSONAL' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_CARGO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_HORARIO' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_LICENCIAS' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_PLANILLA_ASISTENCIA' }),
      this.permissionModel.create({ permissionName: 'PERSONAL_MENU_VER_REGISTRO_PERSONAL' }),
    ]);
    return values;
  }

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionModel.create(createPermissionDto);
  }

  async findAll(permissionPaginationDto:PaginationDto) {
    const{limit=50,offset=1,name}=permissionPaginationDto;

    const totalQuery=this.permissionModel.find();
    
    if (name) {
      totalQuery.where({ permissionName: { $regex: name, $options: 'i' } });
    }
    

    const countQuery=this.permissionModel.find()
    const total = await countQuery.countDocuments();
    console.log("total ", total);

    const page = (offset - 1) * limit;
    const permiso = await totalQuery
      .skip(page)
      .limit(limit)
      .select('-__v')
      .exec();
    return {
      data:permiso,
      total
    };
  }

  async findOne(id: string) {
    return await this.permissionModel.findById(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const findPermission = await this.permissionModel.findById(id)
    if(!findPermission){
      throw new HttpException('permiso no encotrado',404)
    }
    return await this.permissionModel.findByIdAndUpdate(id,updatePermissionDto,{new:true});
  }

  async remove(id: string) {
    return await this.permissionModel.findByIdAndDelete(id);
  }

  async createRandomData(cantidad:number){
    console.log(cantidad)
    // const number=cantidad;
    

    for (let i = 0; i < cantidad; i++) {
      const createPermissionDto: CreatePermissionDto = {
        permissionName: faker.name.firstName(),
      };
      const newPermission = new this.permissionModel(createPermissionDto);
      newPermission.save()
    }
  }
}
