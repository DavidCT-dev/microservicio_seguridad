import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";
export class CreateAppDto {
 
  @ApiProperty()
  @Matches(/^[a-zA-Z]{3,64}$/,{message:'el campo name debe contener solo caracteres' +
  ' y debe ser como minima 3 y maxima 64 caracteres '})
  name:string;

  @ApiProperty() 
  expiresIn: string;

  // @ApiProperty()

  isDeleted?: boolean
}
