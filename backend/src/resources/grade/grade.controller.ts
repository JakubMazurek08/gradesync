import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";


export const gradeController = express.Router();

gradeController.get('/courses', authenticationMiddleware, async (req:Request, res:Response) => {
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
        if(result.rows[0]){
            res.send(result.rows);
        }else{
            res.status(404).send();
        }
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }
})

gradeController.get('/:course', authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
    }

    const courseName = req.params.course;
    if (!courseName) {
        res.status(400).send({ error: "course parameter required" });
    }

    try {
        const teacherResult = await dbClient.query(
            `SELECT
                 c.course_name as "courseName",
                 tu.first_name AS "teacherFirstName",
                 tu.last_name AS "teacherLastName"
             FROM
                 courses c
                     JOIN teachers t ON c.teacher_id = t.id
                     JOIN users tu ON t.user_id = tu.id
             WHERE c.course_name = $1`,
            [courseName]
        );

        if (!teacherResult.rows.length) {
            res.status(404).send('Course not found');
        }

        const gradesResult = await dbClient.query(
            `SELECT
                 g.id AS "gradeId",
                 g.value AS "gradeValue",
                 g.title AS "gradeTitle",
                 g.category AS "gradeCategory"
             FROM grades g
                      JOIN courses c ON g.course_id = c.id
                      JOIN teachers t ON c.teacher_id = t.id
                      JOIN users tu ON t.user_id = tu.id
                      JOIN students s ON g.student_id = s.id
             WHERE c.course_name = $1
               AND s.user_id = $2`,
            [courseName, req.userId]
        );

        res.send({
            courseName: teacherResult.rows[0].courseName,
            teacherFirstName: teacherResult.rows[0].teacherFirstName,
            teacherLastName: teacherResult.rows[0].teacherLastName,
            grades: gradesResult.rows
        });

    } catch (err) {
        res.status(500).send({ msg: 'internal server error', err: err });
    }
});




