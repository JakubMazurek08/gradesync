import express, {Request, Response} from "express";
import {dbClient} from "../config/database";

export const userController = express.Router();

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