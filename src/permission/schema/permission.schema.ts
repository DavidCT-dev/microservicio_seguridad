/* eslint-disable prettier/prettier */
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type PermissionDocument = HydratedDocument<Permission>

@Schema()
export class Permission {
  @Prop({ required: true })
  permissionName:string
}
export const PermissionSchema = SchemaFactory.createForClass(Permission)

