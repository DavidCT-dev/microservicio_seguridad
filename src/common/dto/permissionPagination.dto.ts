/* eslint-disable prettier/prettier */
import { IsOptional, IsPositive, Min, min } from "class-validator";
export class PermissionPaginationDto{
    @IsOptional()
    @IsPositive()
    @Min(1)
    limit?:number;
    @IsOptional()
    // @IsPositive()
    offset?:number;
    @IsOptional()
    permissionName?:string;
}