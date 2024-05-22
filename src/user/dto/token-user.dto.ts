/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class SetTokenUserDto {

  @ApiProperty()
  token:string;
}
