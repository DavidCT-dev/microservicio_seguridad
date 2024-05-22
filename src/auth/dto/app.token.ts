import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AppTokenDto {  
  @ApiProperty()
  @IsString()
  token:string;
  
  @ApiProperty()
  @IsString()
  app: string;
}
