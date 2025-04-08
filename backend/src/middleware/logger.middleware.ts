import {Request, Response, NextFunction} from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const url = req.url;
    const method = req.method;
    const date = new Date();

    console.log(method + " on " + url + " at " + date.toISOString());

    next();
}