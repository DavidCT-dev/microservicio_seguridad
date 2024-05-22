/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreatePermissionDto { 
  @ApiProperty()
  permissionName:string
}
