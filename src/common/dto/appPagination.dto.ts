/* eslint-disable prettier/prettier */
import { IsOptional, IsPositive, Min, min } from "class-validator";
export class AppPaginationDto{
    @IsOptional()
    @IsPositive()
    @Min(1)
    limit?:number;
    @IsOptional()
    // @IsPositive()
    offset?:number;
    @IsOptional()
    name?:string;
}