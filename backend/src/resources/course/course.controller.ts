import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const courseController = express.Router();

/**
 * @swagger
 * /course/{courseId}/date/{date}/lesson-hours:
 *   get:
 *     summary: Get lesson hours for a specific course on a given date
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 08-05-2025
 *         description: Date in DD-MM-YYYY format
 *     responses:
 *       200:
 *         description: List of lesson hours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *       400:
 *         description: Invalid input data (either courseId or date)
 *       404:
 *         description: No lessons found
 *       500:
 *         description: Internal server error
 */
courseController.get("/:courseId/date/:date/lesson-hours", authenticationMiddleware, async (req: Request, res: Response) => {
    const { courseId, date } = req.params;

    // Validate that courseId is a valid number
    if (isNaN(Number(courseId))) {
        res.status(400).json({ error: 'Invalid courseId. Must be a valid number.' });
        return
    }

    const parts = date.split('-');
    if (parts.length !== 3) {
        res.status(400).json({ error: 'Invalid date format. Use DD-MM-YYYY.' });
        return
    }

    const [day, month, year] = parts;
    const formattedDate = `${year}-${month}-${day}`;
    const parsedDate = new Date(formattedDate);

    // Validate that the date is valid
    if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Invalid date value.' });
        return
    }

    const dayOfWeek = parsedDate.getDay() - 1;

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
