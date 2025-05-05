import express, {Request, Response} from "express";
import {dbClient} from "../config/database";
import {ENV} from "../config/env";

export const assignmentsController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;

assignmentsController.get('/', async(req: Request, res:Response) => {
    try{
        const result = await dbClient.query(`SELECT course_name, title, category, date FROM assignments as A left join courses as C on A.course_id = C.id order by date asc`)

            res.send({result: result.rows});
    }catch(err){
        res.status(500).send({msg: 'internal sever error', err:err});
    }
})

assignmentsController.get('/courseName/:name', async(req: Request, res:Response) => {
    const requestedName = req.params.name;
    try{
        const result = await dbClient.query(`SELECT course_name, title, category, date FROM assignments as A left join courses as C on A.course_id = C.id Where course_name = '${requestedName}' order by date asc`)
        const course_name = result.rows[0]?.course_name;
        if(!course_name){
            res.status(400).send("Course name not found")
        }
        res.send({result: result.rows});
    }catch(err){
        res.status(500).send({msg: 'internal sever error', err:err});
    }
})

