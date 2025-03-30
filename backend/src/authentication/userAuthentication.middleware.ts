import type {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import {ENV} from "../config/env";

const secret = ENV.AUTHENTICATION.SECRET;

declare module "express" {
    interface Request {
        user?: string | JwtPayload;
    }
}

export const userAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try{
        if(!secret){
            throw new Error("No secret provided");
        }

        const user = jwt.verify(token, secret) as JwtPayload;

        req.user = user.login;

        next();
    }catch(err){
        res.clearCookie("token");
        res.redirect("/login");
    }
}