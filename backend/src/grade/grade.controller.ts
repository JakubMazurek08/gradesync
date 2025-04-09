import express, {request, Request, Response} from "express";
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

// gradeController.post('/grades', authenticationMiddleware, async (request: Request, response: Response) => {
//     console.log('adding new grade');
//     if(!request.userId){
//         response.status(401).send({error: "unauthorized"});
//     }
//
//     const { value, title, category, studentId, courseId } = request.body;
//
//     if (!studentId || !courseId || value === undefined) {
//         response.status(400).send({msg: "Fields StudentId or courseId or value are required!!" });
//     }
//
//     const newGrade = parseFloat(value);
//     if (newGrade < 0 || newGrade > 100 || isNaN(newGrade)) {
//         response.status(400).send({msg: "Grade must be a number between 0 and 100"});
//     }
//
//     try {
//         const result = await dbClient.query(
//             `INSERT INTO grades (value, title, category, student_id, course_id, created_at)
//              VALUES ($1, $2, $3, $4, $5, NOW())`,
//         );
//         response.status(201).send(result.rows[0]);
//     } catch (err) {
//         response.status(500).send({msg: 'internal server error', err: err});
//     }
// });

// gradeController.patch('/skibidi2', authenticationMiddleware, async (request: Request, response: Response) => {
//     console.log('abc3');
//     if(!request.userId){
//         response.status(401).send({error: "unauthorized"});
//     }
//     try {
//         const result = await dbClient.query(``);
//         response.send(result.rows);
//     } catch (err) {
//         response.status(500).send({msg: 'internal server error', err:err});
//     }
// })
