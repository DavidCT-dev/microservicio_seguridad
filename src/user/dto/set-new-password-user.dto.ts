/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class SetNewPasswordUserDto {

  @ApiProperty()
  email:string;

}
