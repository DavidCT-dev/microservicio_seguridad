import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DecodedTokenDto {  
  @ApiProperty()
  @IsString()
  token:string;
}