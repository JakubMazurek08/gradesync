import express, {Request, Response} from "express";
import {dbClient} from "../config/database";
import {authenticationMiddleware} from "../middleware/authentication.middleware";


export const gradeController = express.Router();

gradeController.get('/courses', authenticationMiddleware, async (req:Request, res:Response) => {
    console.log('abc');
    if(!req.userId){
        res.status(401).send({error: "unauthorized"});
    }

    try{
        const result = await dbClient.query(`SELECT
                                        c.id AS course_id,
                                            c.course_name,
                                            COALESCE(AVG(g.value), 0) AS average_grade
                                        FROM students s
                                        JOIN users u ON s.user_id = u.id
                                        JOIN students_courses sc ON s.id = sc.student_id
                                        JOIN courses c ON sc.course_id = c.id
                                        LEFT JOIN grades g ON g.student_id = s.id AND g.course_id = c.id
                                        WHERE u.id = ${req.userId}
                                        GROUP BY c.id, c.course_name;
                                        `)

        res.send(result.rows);
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }

})


