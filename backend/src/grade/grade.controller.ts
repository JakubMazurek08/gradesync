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
                                                 c.id AS "courseId",
                                                 c.course_name as "courseName",
                                                 COALESCE(AVG(g.value), 0) AS "averageGrade",
                                                 tu.first_name AS "teacherFirstName",
                                                 tu.last_name AS "teacherLastName"
                                             FROM students s
                                                      JOIN users u ON s.user_id = u.id
                                                      JOIN students_courses sc ON s.id = sc.student_id
                                                      JOIN courses c ON sc.course_id = c.id
                                                      LEFT JOIN grades g ON g.student_id = s.id AND g.course_id = c.id
                                                      JOIN teachers t ON c.teacher_id = t.id
                                                      JOIN users tu ON t.user_id = tu.id
                                             WHERE s.user_id = ${req.userId}
                                             GROUP BY c.id, c.course_name, tu.first_name, tu.last_name`);
        res.send(result.rows);
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }

})