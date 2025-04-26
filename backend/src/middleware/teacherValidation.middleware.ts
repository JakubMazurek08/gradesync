import type {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import {ENV} from "../config/env";
import {dbClient} from "../config/database";

const secret = ENV.AUTHENTICATION.SECRET;

declare module "express" {
    interface Request {
        userId?: string | JwtPayload;
    }
}

export const teacherAuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try{
        if(!secret){
            throw new Error("No secret provided");
        }

        const payload = jwt.verify(token, secret) as JwtPayload;

        const teacherUser = await dbClient.query(`SELECT * FROM teachers where user_id=$1`,[payload.userId]);

        if(teacherUser.rows[0]){
            req.userId = payload.userId;
            next();
        }else{
            res.status(403).json({ error: "Forbidden" });
        }

    }catch(err){
        res.status(500).json({ error: err });
        res.clearCookie("token");
    }
}