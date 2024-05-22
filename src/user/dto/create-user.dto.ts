/* eslint-disable prettier/prettier */
export class CreateUserDto {
  email:string;

  password:string;

  roles: string[];

  app: string[]

  token: string;

  failedLoginAttempts: number;

  isLocked: boolean;
  
  lockedUntil: Date;
  
  fullName:string
  
}
