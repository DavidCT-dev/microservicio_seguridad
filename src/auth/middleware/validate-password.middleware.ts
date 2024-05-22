import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidatePasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const { password } = req.body;
    
    const expectedFields = ['password'];

    const extraFields = Object.keys(req.body).filter(
      (key) => !expectedFields.includes(key)
    );

    if (extraFields.length > 0) {
      throw new HttpException('no altere los campos', 400);
    }

    if ( !password ) {
      throw new HttpException('el campo password es requerido', 400);
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      throw new HttpException('Ingrese una contraseña con almenos una letra, un digito 0-9 y con 8 caracteres como minimo', 400);
    }
    
        
    next();
  }
}
