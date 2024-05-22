/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";
import { Permission } from "src/permission/schema/permission.schema";

export class SetPermissionToRolDto { 
  @ApiProperty()
  permissionName: string;
}
