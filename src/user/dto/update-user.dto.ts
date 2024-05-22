/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";
export class UpdateAppDto {
  @ApiProperty()
  name:string;

}