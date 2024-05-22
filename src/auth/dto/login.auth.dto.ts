/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginAuthDto {  
  @ApiProperty()
  @IsString()
  email:string;
  

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  app: string;
}
