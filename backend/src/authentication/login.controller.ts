import jwt from "jsonwebtoken";
import express, {Request, Response} from "express";
import {ENV} from "../config/env";
import {dbClient} from "../config/database";
import {userAuthenticationMiddleware} from "./userAuthentication.middleware";

export const loginController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;


loginController.post("/", async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;

        const result = await dbClient.query(`SELECT password FROM users WHERE login = '${login}'`);
        const userPassword = result.rows[0].password;
        if(!userPassword){
            res.status(404).send({msg: "User not found"});
            return;
        }

        if(!secret){
            throw new Error();
        }

        if(userPassword === password){
            const token = jwt.sign({login}, secret , { expiresIn: "1h" });
            res.cookie("token", token);
            res.status(200).send({msg:"Logged In Succesfully!"});
        }else{
            res.status(401).send({msg: "Invalid Credentials"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Internal Server Error"});
    }

});

loginController.get("/", userAuthenticationMiddleware, async (req: Request, res: Response) => {
    console.log(req.user);
    if(!req.user){
        res.status(401).send({error: "unauthorized"});
    }
    try {
        res.send({msg:`Logged In As ${req.user}`});
    }catch(err){
        res.status(500).send({error: "Internal Server Error"});
    }
})