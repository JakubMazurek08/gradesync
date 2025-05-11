import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {ENV} from "../../config/env";
import fs from 'fs';
import path from 'path';



export const devController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;


devController.get('/reset', async (req:Request, res:Response) => {
    if(req.body.password != secret){
        res.status(403).send('forbidden');
    }

    try{
        const resetDatabaseQuery = fs.readFileSync(path.join(__dirname, '../../lib/resetDatabase.sql'), 'utf-8');

        const result = await dbClient.query(resetDatabaseQuery);
        res.send(result);
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }
});
