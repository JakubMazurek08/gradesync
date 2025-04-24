import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {teacherAuthenticationMiddleware} from "../../middleware/teacherAuthentication.middleware";

export const teacherController = express.Router();

teacherController.get('/courses', teacherAuthenticationMiddleware, async (req:Request, res:Response) => {
    if(!req.userId){
        res.status(401).send({error: "unauthorized"});
    }

    try{
        const result = await dbClient.query(`
        SELECT c.id as "id",
               c.course_name as "courseName"
        FROM Courses C 
        JOIN teachers T ON t.id  = c.teacher_id
        WHERE t.user_id = $1`, [req.userId]);


        if(result.rows[0]){
            res.send(result.rows);
        }else{
            res.status(404).send();
        }
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }
})