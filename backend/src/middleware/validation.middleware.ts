import {Request, Response, NextFunction} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";

export const validationMiddleware = (DtoClass:any) => {
    return async (req:Request,res:Response,next:NextFunction) => {
        try {
            const dtoInstance = plainToInstance(DtoClass, req.body);
            const errors = await validate(dtoInstance);
            console.log(errors);

            if (errors.length > 0) {
                res.status(400).send({
                    errors
                })
                return
            }

            next()
        }catch(error){
            res.status(400).send();
        }
    }
}

