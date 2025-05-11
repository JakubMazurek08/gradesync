import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function validateDto<T>(DtoClass: new () => T): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const instance = plainToInstance(DtoClass, req.body);
        const errors = await validate(instance, { whitelist: true });

        if (errors.length > 0) {
            res.status(400).json({
                message: 'Validation failed',
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
            return;
        }
        req.body = instance;
        next();
    };
}
