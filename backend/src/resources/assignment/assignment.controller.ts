import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {isTeacher} from "../../lib/isTeacher";
import {QueryResult} from "pg";

export const assignmentController = express.Router();

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


assignmentController.get("/", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
    }

    try {
        const schoolResult = await dbClient.query(`
            SELECT s.id AS "schoolId"
            FROM schools s
            JOIN users u ON s.id = u.school_id
            WHERE u.id = $1
        `, [req.userId]);

        const schoolId = schoolResult.rows[0]?.schoolId;

        if (!schoolId) {
            res.status(404).send({ error: "School not found for the user" });
        }

        const timetableResult = await dbClient.query(`SELECT timetable FROM schools WHERE id = $1`, [schoolId]);
        let timetable = timetableResult.rows[0]?.timetable;

        if (!timetable) {
            res.status(400).send("Timetable not found");
        }

        let daysResult: QueryResult<any>;
        let assignmentsResult: QueryResult<any>;

        if (await isTeacher(req.userId)) {
            daysResult = await dbClient.query(`
                SELECT d.lesson_hour AS "lessonHour",
                       d.day_of_the_week AS "dayOfTheWeek",
                       c.course_name AS "courseName"
                FROM days d
                JOIN courses c ON c.id = d.course_id
                JOIN teachers t ON c.teacher_id = t.id
                JOIN users u ON t.user_id = u.id
                WHERE u.id = $1;
            `, [req.userId]);

            assignmentsResult = await dbClient.query(`
                SELECT a.title,
                       a.lesson_hour AS "lessonHour",
                       a.date::text,
                       c.course_name AS "courseName",
                       a.category
                FROM assignments a
                JOIN courses c ON a.course_id = c.id
                JOIN teachers t ON c.teacher_id = t.id
                JOIN users u ON t.user_id = u.id
                WHERE u.id = $1;
            `, [req.userId]);
        } else {
            daysResult = await dbClient.query(`
                SELECT d.lesson_hour AS "lessonHour",
                       d.day_of_the_week AS "dayOfTheWeek",
                       c.course_name AS "courseName"
                FROM days d
                JOIN courses c ON c.id = d.course_id
                WHERE c.schools_id = $1
            `, [schoolId]);

            assignmentsResult = await dbClient.query(`
                SELECT a.title,
                       a.lesson_hour AS "lessonHour",
                       a.date::text,
                       c.course_name AS "courseName",
                       a.category
                FROM assignments a
                JOIN courses c ON a.course_id = c.id
                JOIN students_courses sc ON sc.course_id = c.id
                JOIN students s ON sc.student_id = s.id
                JOIN users u ON s.user_id = u.id
                WHERE u.id = $1;
            `, [req.userId]);
        }

        timetable = timetable.split(';').map((lessonTimes: string) => {
            const [start, end] = lessonTimes.split('-');
            return {
                startTime: start,
                endTime: end,
            };
        });

        const fullTimeTable: Course[][] = [[], [], [], [], [], [], []];
        const assignments: Assignment[] = [];

        daysResult.rows.forEach(day => {
            fullTimeTable[day.dayOfTheWeek].push({
                startTime: timetable[day.lessonHour - 1].startTime,
                endTime: timetable[day.lessonHour - 1].endTime,
                courseName: day.courseName
            });
        });

        assignmentsResult.rows.forEach(assignment => {
            assignments.push({
                startTime: timetable[assignment.lessonHour - 1].startTime,
                endTime: timetable[assignment.lessonHour - 1].endTime,
                name: assignment.title,
                category: assignment.category,
                courseName: assignment.courseName,
                date: assignment.date,
            });
        });

        res.json({
            timetable: fullTimeTable,
            assignments: assignments
        });
    } catch (err) {
        console.error("Error fetching timetable/assignments:", err);
        res.status(500).send({ msg: 'Internal server error', err });
    }
});

assignmentController.post("/", authenticationMiddleware, async (req: Request, res: Response) => {
    const {title, lessonHour, date, course, category, description} = req.body;

    try {
        const insertRes = await dbClient.query(
            `INSERT INTO assignments (title, lesson_hour, date, course_id, category, description)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, lessonHour, date, course, category, description]
        );

        res.status(201).json(insertRes.rows[0]);
    } catch (err) {
        res.status(500).json({error: "Internal server error", details: err});
        return
    }
});

assignmentController.put("/:id", authenticationMiddleware, async (req: Request, res: Response) => {
    const {id} = req.params;
    const {title, lessonHour, date, courseString, category, description} = req.body;

    try {
        const match = courseString.match(/^(.+)\$(\d{4})-(\d{4})$/);
        if (!match) {
            res.status(400).json({error: "Invalid course string format"});
            return
        }

        const courseName = match[1];
        const startYear = parseInt(match[2]);
        const endYear = parseInt(match[3]);


        const courseRes = await dbClient.query(
            `SELECT id FROM courses WHERE course_name = $1`, [courseName]
        );

        if (courseRes.rowCount === 0) {
            res.status(404).json({error: "Course not found"});
            return
        }

        const courseId = courseRes.rows[0].id;

        const updateRes = await dbClient.query(
            `UPDATE assignments
             SET title = $1, lesson_hour = $2, date = $3, course_id = $4, category = $5, description = $6
             WHERE id = $7
             RETURNING *`,
            [title, lessonHour, date, courseId, category, description , id]
        );

        res.json(updateRes.rows[0]);
    } catch (err) {
        res.status(500).json({error: "Internal server error", details: err});
    }
});


assignmentController.delete("/:id", authenticationMiddleware, async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const deleteRes = await dbClient.query(
            `DELETE FROM assignments WHERE id = $1 RETURNING *`, [id]
        );

        if (deleteRes.rowCount === 0) {
            res.status(404).json({error: "Assignment not found"});
            return
        }

        res.json({message: "Assignment deleted", assignment: deleteRes.rows[0]});
    } catch (err) {
        res.status(500).json({error: "Internal server error", details: err});
    }
});
