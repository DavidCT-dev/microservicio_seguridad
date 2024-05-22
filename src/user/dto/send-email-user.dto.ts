/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class SendEmailUserDto {

  @ApiProperty()
  to:string
  @ApiProperty()
  subject:string
  @ApiProperty()
  text:string;

}
