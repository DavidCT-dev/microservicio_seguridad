/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class PermissionRolDto { 
  @ApiProperty()
  permissionId:string;
}
