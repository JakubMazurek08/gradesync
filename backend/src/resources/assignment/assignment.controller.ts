import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {isTeacher} from "../../lib/isTeacher";
import {QueryResult} from "pg";
import {validationMiddleware} from "../../middleware/validation.middleware";
import {AssignmentDto} from "./dto/assignment.dto";

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

/**
 * @swagger
 * /assignment:
 *   get:
 *     summary: Get timetable and assignments for the logged-in user.
 *     description: This endpoint returns the timetable and assignments for either a teacher or a student, depending on the user role.
 *     tags:
 *       - Assignments
 *     responses:
 *       200:
 *         description: Timetable and assignments data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetable:
 *                   type: array
 *                   description: Array of days with lesson timings and course names
 *                   items:
 *                     type: object
 *                     properties:
 *                       startTime:
 *                         type: string
 *                         description: Start time of the lesson
 *                       endTime:
 *                         type: string
 *                         description: End time of the lesson
 *                       courseName:
 *                         type: string
 *                         description: Name of the course
 *                 assignments:
 *                   type: array
 *                   description: Array of assignments with related information
 *                   items:
 *                     type: object
 *                     properties:
 *                       startTime:
 *                         type: string
 *                         description: Start time of the assignment
 *                       endTime:
 *                         type: string
 *                         description: End time of the assignment
 *                       name:
 *                         type: string
 *                         description: Name of the assignment
 *                       category:
 *                         type: string
 *                         description: Category of the assignment (e.g., homework, exam)
 *                       courseName:
 *                         type: string
 *                         description: Name of the course related to the assignment
 *                       date:
 *                         type: string
 *                         description: Date of the assignment
 *       401:
 *         description: Unauthorized, user is not logged in
 *       404:
 *         description: School not found for the user
 *       500:
 *         description: Internal server error
 */
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
        console.error("Error fetching timetable/assignment:", err);
        res.status(500).send({ msg: 'Internal server error', err });
    }
});


/**
 * @swagger
 * /assignment:
 *   post:
 *     summary: Create a new assignment.
 *     description: This endpoint allows the creation of a new assignment for a course.
 *     tags:
 *       - Assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the assignment
 *               lessonHour:
 *                 type: integer
 *                 description: Lesson hour (1-6)
 *               date:
 *                 type: string
 *                 description: Date of the assignment
 *               course:
 *                 type: integer
 *                 description: ID of the course the assignment belongs to
 *               category:
 *                 type: string
 *                 description: Category of the assignment (e.g., homework, exam)
 *               description:
 *                 type: string
 *                 description: Description of the assignment
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created assignment
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized, user is not logged in
 *       500:
 *         description: Internal server error
 */
assignmentController.post("/", authenticationMiddleware, validationMiddleware(AssignmentDto), async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /assignment/{id}:
 *   put:
 *     summary: Update an existing assignment.
 *     description: This endpoint allows the update of an existing assignment.
 *     tags:
 *       - Assignments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the assignment to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the assignment
 *               lessonHour:
 *                 type: integer
 *                 description: Lesson hour (1-6)
 *               date:
 *                 type: string
 *                 description: Date of the assignment
 *               courseString:
 *                 type: string
 *                 description: Course name and year (e.g., Math$2022-2023)
 *               category:
 *                 type: string
 *                 description: Category of the assignment (e.g., homework, exam)
 *               description:
 *                 type: string
 *                 description: Description of the assignment
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated assignment
 *       400:
 *         description: Invalid input data or course not found
 *       401:
 *         description: Unauthorized, user is not logged in
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
assignmentController.put("/:id", authenticationMiddleware, validationMiddleware(AssignmentDto), async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /assignment/{id}:
 *   delete:
 *     summary: Delete an assignment.
 *     description: This endpoint allows the deletion of an assignment.
 *     tags:
 *       - Assignments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the assignment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Assignment not found
 *       401:
 *         description: Unauthorized, user is not logged in
 *       500:
 *         description: Internal server error
 */
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
