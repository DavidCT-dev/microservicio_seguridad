/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class CreateRolDto { 
  @ApiProperty()
  // @IsNotEmpty({message:'el campo name es requerido'})
  // @Matches(/^[a-zA-Z]{3,64}$/,{message:'el campo name debe contener solo caracteres' +
  // ' y debe ser como minima 3 y maxima 64 caracteres '})
  rolName:string;
  @ApiProperty()
  // @IsNotEmpty({message:'el campo aplicattion es requerido'})
  aplicattion:string;
  isActive:boolean;
}
