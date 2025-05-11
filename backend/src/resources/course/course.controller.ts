import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {isTeacher} from "../../lib/isTeacher";
import {QueryResult} from "pg";
import {assignmentController} from "../assignment/assignment.controller";

export const courseController = express.Router();

courseController.get("/:courseId/date/:date/lesson-hours", authenticationMiddleware, async (req: Request, res: Response) => {
    const { courseId, date } = req.params;

    const [day, month, year] = date.split('-');
    const formattedDate = `${year}-${month}-${day}`;

    const dayOfWeek = new Date(formattedDate).getDay() - 1;

    try {
        const result = await dbClient.query(
            `
            SELECT lesson_hour
            FROM days
            WHERE course_id = $1 AND day_of_the_week = $2
            `,
            [courseId, dayOfWeek]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'No lessons found for this course on the specified date.' });
            return;
        }

        res.send(
            result.rows.map((row: { lesson_hour: number }) => row.lesson_hour),
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
