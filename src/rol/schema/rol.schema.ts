/* eslint-disable prettier/prettier */
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type RolDocument = HydratedDocument<Rol>

@Schema()
export class Rol {
  @Prop({ required: true})
  rolName:string
  @Prop({ required: true})
  aplicattion:string
  @Prop({default:true})
  isActive:boolean
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
  permissionName: string[];
}
export const RolSchema = SchemaFactory.createForClass(Rol)

