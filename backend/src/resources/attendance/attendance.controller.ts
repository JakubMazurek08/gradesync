import express, {request, Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const attendanceController = express.Router();


attendanceController.get('/courses', authenticationMiddleware, async (request: Request, response: Response) => {
    if(!request.userId){
        response.status(401).send({error: "unauthorized"});
    }

    try {
        const result = await dbClient.query(`
        `);

        if (result.rows[0]) {
            response.send(result.rows);
        } else {
            response.status(404).send();
        }
    }
    catch (error) {
        response.status(500).send({message: 'internal server error', error: error});
    }
})

attendanceController.get('/:course', authenticationMiddleware, async (request: Request, response: Response) => {
    if (!request.userId) {
        response.status(401).send({error: "unauthorized"});
    }

    const courseName = request.params.course;
    if (!courseName) {
        response.status(400).send({error: "course parameter required"});
    }

    try {
        const courseResult = await dbClient.query(
            `
            SELECT 
                c.id,
                c.course_name as "courseName",
                tu.first_name AS "teacherFirstName",
                tu.last_name AS "teacherLastName"
            FROM courses c
            JOIN teachers t ON c.teacher_id = t.id
            JOIN users tu ON t.user_id = tu.id
            WHERE c.course_name = $1`,
            [courseName]
        );
        if (courseResult.rows[0]) {
            response.status(404).send('Course not found');
            return;
        }

        const studentResult = await dbClient.query(
            `SELECT s.id
                FROM students s
                WHERE s.user_id = $1`,
                [request.userId]
        );

        if (!studentResult.rows.length) {
            response.status(404).send('Student not found');
        }

        const studentId = studentResult.rows[0].id

        const attendanceResult = await dbClient.query(
            ``
        );

    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error});
    }
});