import express, {Request, Response} from "express";
import {dbClient} from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {ENV} from "../config/env";

export const userController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;

userController.post("/register", async (req: Request, res: Response) => {
    const {fullName, email, login, password} = req.body;
    const [firstName, lastName] = fullName.split(" ");
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const result = await dbClient.query(
            `INSERT INTO users (first_name, last_name, email, login, password) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [firstName, lastName, email, login, hashedPassword]
        );

        if(!secret){
            throw new Error();
        }

        const userId = result.rows[0].id;

        const token = jwt.sign({ userId }, secret, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).send({ id: userId });
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }

})

userController.get("/firstName/:id", async (req: Request, res: Response) => {
    const requestedId = req.params.id;
    try{
        const result = await dbClient.query(`SELECT first_name FROM users WHERE id = '${requestedId}'`);

        const firstName = result.rows[0]?.first_name;

        if(!firstName){
            res.status(400).send("First name not found");
        }

        res.send({firstName: firstName});
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }
});