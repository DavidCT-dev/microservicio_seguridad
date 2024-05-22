/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class SetPasswordUserDto {

  @ApiProperty()
  password:string;

}
