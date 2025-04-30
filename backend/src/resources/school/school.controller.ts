import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {isTeacher} from "../../lib/isTeacher";
import {QueryResult} from "pg";

export const schoolController = express.Router();

type Course = {
    startTime: string;
    endTime: string;
    courseName: string;
}

type Assignment = {
    startTime: string,
    endTime: string,
    name: string,
    category: string,
    courseName: string,
    date: string,
}


schoolController.get("/timetable/:id", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({error: "unauthorized"});
    }

    const requestedId = req.params.id;
    try {
        const timetableResult = await dbClient.query(`SELECT timetable
                                                      FROM schools
                                                      WHERE id = $1`, [requestedId]);

        let daysResult: QueryResult<any>;
        let assignmentsResult: QueryResult<any>;


        if (await isTeacher(req.userId)) {
            daysResult = await dbClient.query(`
                SELECT d.lesson_hour     AS "lessonHour",
                       d.day_of_the_week AS "dayOfTheWeek",
                       c.course_name     AS "courseName"
                FROM days d
                         JOIN courses c ON c.id = d.course_id
                         JOIN teachers t ON c.teacher_id = t.id
                         JOIN users u ON t.user_id = u.id
                WHERE u.id = $1;
            `, [req.userId]);

            assignmentsResult = await dbClient.query(`
                SELECT a.title,
                       a.lesson_hour AS "lessonHour",
                       a.date::text, c.course_name AS "courseName",
                       a.category
                FROM assignments a
                         JOIN courses c ON a.course_id = c.id
                         JOIN teachers t ON c.teacher_id = t.id
                         JOIN users u ON t.user_id = u.id
                WHERE u.id = $1;
            `, [req.userId]);
        } else {
            daysResult = await dbClient.query(`
                SELECT d.lesson_hour     as "lessonHour",
                       d.day_of_the_week as "dayOfTheWeek",
                       c.course_name     as "courseName"
                FROM days d
                         JOIN courses c ON c.id = d.course_id
                WHERE c.schools_id = $1`, [requestedId]);

            assignmentsResult = await dbClient.query(`SELECT a.title,
                                                             a.lesson_hour AS "lessonHour",
                                                             a.date::text, c.course_name AS "courseName",
                                                             a.category
                                                      FROM assignments a
                                                               JOIN courses c ON a.course_id = c.id
                                                               JOIN students_courses sc ON sc.course_id = c.id
                                                               JOIN students s ON sc.student_id = s.id
                                                               JOIN users u ON s.user_id = u.id
                                                      WHERE u.id = $1;
            `, [req.userId])
        }

        let timetable = timetableResult.rows[0]?.timetable;

        if (!timetable) {
            res.status(400).send("Timetable not found");
        }

        const days = daysResult.rows

        timetable = timetable.split(';').map((lessonTimes: string) => {
            const [start, end] = lessonTimes.split('-');
            return ({
                startTime: start,
                endTime: end,
            })
        })

        const fullTimeTable: Course[][] = [[], [], [], [], [], [], []];
        const assignments: Assignment[] = [];

        days.forEach(day => {
            fullTimeTable[day.dayOfTheWeek].push(
                {
                    startTime: timetable[day.lessonHour - 1].startTime,
                    endTime: timetable[day.lessonHour - 1].endTime,
                    courseName: day.courseName
                }
            )
        })

        assignmentsResult.rows.forEach(assignment => {
            assignments.push({
                startTime: timetable[assignment.lessonHour - 1].startTime,
                endTime: timetable[assignment.lessonHour - 1].endTime,
                name: assignment.title,
                category: assignment.category,
                courseName: assignment.courseName,
                date: assignment.date,
            });
        })

        res.json({
            timetable: fullTimeTable,
            assignments: assignments
        });
    } catch (err) {
        res.status(500).send({msg: 'internal sever error', err: err});
    }
});