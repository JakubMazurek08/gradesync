import jwt from "jsonwebtoken";
import express, {Request, Response} from "express";
import {ENV} from "../config/env";
import {dbClient} from "../config/database";
import {userAuthenticationMiddleware} from "./userAuthentication.middleware";
import bcrypt from "bcrypt"

export const loginController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;


loginController.post("/", async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;

        const result = await dbClient.query(`SELECT password, id FROM users WHERE login = '${login}'`);
        const userPassword = result.rows[0]?.password;
        const userId = result.rows[0]?.id;

        if(!userPassword){
            res.status(404).send();
            return;
        }

        if(!secret){
            throw new Error();
        }

        bcrypt.compare(password, userPassword, function(err, result) {
            if(result){
                const token = jwt.sign({userId}, secret , { expiresIn: "1h" });
                res.cookie("token", token);
                res.status(200).send({id: userId});
            }else{
                res.status(401).send();
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Internal Server Error"});
    }

});

loginController.get("/", userAuthenticationMiddleware, async (req: Request, res: Response) => {
    if(!req.userId){
        res.status(401).send({error: "unauthorized"});
    }
    try {
        res.send({id:req.userId});
    }catch(err){
        res.status(500).send({error: "Internal Server Error"});
    }
})