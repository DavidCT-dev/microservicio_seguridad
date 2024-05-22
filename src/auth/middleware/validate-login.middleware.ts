import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const { email, password, app } = req.body;
    
    const expectedFields = ['email', 'password', 'app'];

    const extraFields = Object.keys(req.body).filter(
      (key) => !expectedFields.includes(key)
    );

    if (extraFields.length > 0) {
      throw new HttpException('Campos no válidos en la solicitud', 400);
    }

    if (!email || !password || !app) {
      throw new HttpException('los campos email, password y app son requeridos', 400);
    }
    
    if(!(/[0-9a-zA-Z._-]{4,30}$/).test(email)){
      throw new HttpException('ingrese el email o userName, valido', 400);
    }
    

    if(app != 'central'){
      throw new HttpException('la app no existe', 400);
    }
    
    next();
  }
}
