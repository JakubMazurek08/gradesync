import type {Request, Response, NextFunction} from "express";
import {ENV} from "../config/env";
import {dbClient} from "../config/database";

export const teacher_validationMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    if (!request.userId) {
        response.status(401).json({error: 'Unauthorized'});
        return;
    }
    const { courseId, studentId } = request.body;

    if (!courseId || !studentId) {
        response.status(400).json({error: "You are not authorized for adding grades for this course"});
        return;
    }

    try {

        const checkTeacher = await dbClient.query(`SELECT
                                                          * FROM teachers as t
                                                          JOIN courses as c ON t.id = c.teacher_id
                                                          WHERE t.user_id = $1 and c.id = $2`)

        if (checkTeacher.rows.length === 0) {
            response.status(404).send({error: 'Teacher not found'})
        }

        const checkStudent = await dbClient.query(`SELECT
                                                         * FROM students_courses as sc
                                                         JOIN students as s ON sc.student_id = s.id
                                                         WHERE s.id = $1 and sc.course_id = $2
    `);

        if (checkStudent.rows.length === 0) {
            response.status(404).send({error: 'Student not found'})
        }
        next();
    } catch (error) {
        response.status(500).send({msg: 'internal server error', error:error})
    }

}