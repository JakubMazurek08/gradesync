import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {teacherAuthenticationMiddleware} from "../../middleware/teacherAuthentication.middleware";

export const teacherController = express.Router();

/**
 * @swagger
 * /teacher/courses:
 *   get:
 *     summary: Get all courses taught by the logged-in teacher.
 *     description: This endpoint returns a list of courses the teacher is associated with.
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The course ID
 *                   courseName:
 *                     type: string
 *                     description: The name of the course
 *                   yearString:
 *                     type: string
 *                     description: The course start and end year as a string (e.g., 2022-2023)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No courses found
 *       500:
 *         description: Internal server error
 */
teacherController.get('/courses', teacherAuthenticationMiddleware, async (req:Request, res:Response) => {
    if(!req.userId){
        res.status(401).send({error: "unauthorized"});
    }

    try{
        const result = await dbClient.query(`
        SELECT c.id as "id",
               c.course_name as "courseName",
               c.start_year::text || '-' || c.end_year::text as "yearString"
        FROM Courses C 
        JOIN teachers T ON t.id  = c.teacher_id
        WHERE t.user_id = $1`, [req.userId]);

        if(result.rows[0]){
            res.send(result.rows);
        }else{
            res.status(404).send();
        }
    }catch(err){
        res.status(500).send({msg:'internal server error', err:err});
    }
})
