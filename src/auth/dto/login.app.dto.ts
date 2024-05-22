/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginToAppDto {  
  @ApiProperty()
  @IsString()
  token:string;
  
  @ApiProperty()
  @IsString()
  appUuid: string;
}