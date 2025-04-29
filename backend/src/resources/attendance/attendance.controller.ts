import express, { Request, Response } from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {teacherAuthenticationMiddleware} from "../../middleware/teacherValidation.middleware";


export const attendanceController = express.Router();


attendanceController.get('/', authenticationMiddleware, async (request: Request, response: Response) => {
    if(!request.userId){
        response.status(401).send({error: "unauthorized"});
    }

    try {
        const result = await dbClient.query(`
        SELECT 
            a.id AS "attendanceId",
            a.date AS "date",
            a.status AS "status",
            c.course_name AS "courseName",
            d.lesson_hour AS "lessonHour",
            d.day_of_the_week AS "dayOfWeek",
            tu.first_name AS "teacherFirstName",
            tu.last_name AS "teacherLastName"
        FROM students s
        JOIN attendance a ON s.id = a.student_id
        JOIN users u ON s.user_id = u.id
        JOIN days d ON 
        CASE EXTRACT(DOW FROM a.date)
            WHEN 0 THEN 'sunday'
            WHEN 1 THEN 'monday'
            WHEN 2 THEN 'tuesday'
            WHEN 3 THEN 'wednesday'
            WHEN 4 THEN 'thursday'
            WHEN 5 THEN 'friday'
            WHEN 6 THEN 'saturday'
        END = d.day_of_the_week
        JOIN courses c ON d.course_id = c.id
        JOIN teachers t ON c.teacher_id = t.id
        JOIN users tu ON t.user_id = tu.id
        WHERE s.user_id = $1
        ORDER BY a.date DESC, d.lesson_hour ASC`,
            [request.userId]
        );

        if (result.rows.length > 0) {
            response.send(result.rows);
        } else {
            response.status(404).send({message: "No attendance records found"});
        }
    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error});
    }
});

attendanceController.get('/sum', authenticationMiddleware, async (request: Request, response: Response) => {
    if (!request.userId) {
        response.status(401).send({error: "unauthorized"});
        return;
    }

    try {
        const result = await dbClient.query(`
        SELECT
            COUNT(a.id) AS "totalRecords",
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS "presentCount",
            SUM(CASE WHEN a.status = 'absent_unexcused' THEN 1 ELSE 0 END) AS "absentUnexcusedCount",
            SUM(CASE WHEN a.status = 'absent_excused' THEN 1 ELSE 0 END) AS "absentExcusedCount",
            SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS "lateCount",
            FROM students s
            JOIN attendance a ON s.id = a.student_id
            WHERE s.user_id = $1`,
            [request.userId]
        );
        response.send(result.rows[0]);
    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error})
    }
})


attendanceController.get('/date/:date', authenticationMiddleware, async (request: Request, response: Response) => {
    if (!request.userId) {
        response.status(401).send({error: "unauthorized"});
        return;
    }

    const date = request.params.date;
    // date format YYYYY-MM-DD
    if (!date) {
        response.status(400).send({error: "date parameter required"});
        return;
    }
    try {
        const result = await dbClient.query(`
            SELECT 
            a.id AS "attendanceId",
            a.date AS "date",
            a.status AS "status",
            c.course_name AS "courseName",
            d.lesson_hour AS "lessonHour",
            d.day_of_the_week AS "dayOfWeek",
            tu.first_name AS "teacherFirstName",
            tu.last_name AS "teacherLastName"
        FROM students s
        JOIN attendance a ON s.id = a.student_id
        JOIN users u ON s.user_id = u.id
        JOIN days d ON 
        CASE EXTRACT(DOW FROM a.date)
            WHEN 0 THEN 'sunday'
            WHEN 1 THEN 'monday'
            WHEN 2 THEN 'tuesday'
            WHEN 3 THEN 'wednesday'
            WHEN 4 THEN 'thursday'
            WHEN 5 THEN 'friday'
            WHEN 6 THEN 'saturday'
        END = d.day_of_the_week
        JOIN courses c ON d.course_id = c.id
        JOIN teachers t ON c.teacher_id = t.id
        JOIN users tu ON t.user_id = tu.id
        WHERE s.user_id = $1
        AND a.date = $2
        ORDER BY d.lesson_hour ASC `,
        [request.userId, date]
        );

        if (result.rows.length > 0) {
            response.send(result.rows);
        } else {
            response.send(404).send({message: "No attendance records for that day"});
        }

    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error})
    }
});

attendanceController.post('/', teacherAuthenticationMiddleware, async (request: Request, response: Response) => {
    const { studentId, date, status } = request.body;

    if (!studentId || !date || !status) {
       response.status(400).send({ error: "studentId, date and status are required" });
       return
    }

    // Validate status
    const validStatuses = ['present', 'absent_excused', 'absent_unexcused', 'late'];
    if (!validStatuses.includes(status)) {
         response.status(400).send({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
         return
    }

    try {
        // Insert attendance record
        const result = await dbClient.query(`
            INSERT INTO attendance (student_id, date, status)
            VALUES ($1, $2, $3)
            RETURNING id AS "attendanceId", student_id AS "studentId", date, status
        `, [studentId, date, status]);

        response.status(201).send(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'internal server error', error: error });
    }
});

