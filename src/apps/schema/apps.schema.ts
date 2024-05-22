import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Rol } from "src/rol/schema/rol.schema";
import { v4 as uuidv4 } from 'uuid';

export type AppDocument = HydratedDocument<App>

@Schema()
export class App {
  @Prop({ type:String, default: () => uuidv4() })
  uuid: string;

  @Prop({required:true})
  name:string

  @Prop({ required: true })
  expiresIn: string 

  @Prop({ default:false })  
  isDeleted?: boolean
}
export const AppSchema = SchemaFactory.createForClass(App)