import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {teacherAuthenticationMiddleware} from "../../middleware/teacherAuthentication.middleware";
import {validationMiddleware} from "../../middleware/validation.middleware";
import {GradeDto} from "./dto/grade.dto";


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
                 g.category AS "gradeCategory",
                 g.description AS "gradeDescription"
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

gradeController.get('/:course/students', teacherAuthenticationMiddleware, async (req: Request, res: Response) => {
    const teacherId = req.userId;
    const [courseName, yearRange] = req.params.course.split('$');
    const [startYearStr, endYearStr] = yearRange.split('-');

    const startYear = parseInt(startYearStr, 10);
    const endYear = parseInt(endYearStr, 10);


    if (!teacherId || !courseName || isNaN(startYear) || isNaN(endYear)) {
        res.status(400).json({ error: "Invalid request parameters" });
    }

    const query = `
    SELECT 
        s.id AS student_id,
        u.first_name,
        u.last_name,
        g.id AS grade_id,
        g.value,
        g.title,
        g.category,
        g.description,
        g.created_at
    FROM courses c
    JOIN students_courses sc ON sc.course_id = c.id
    JOIN students s ON s.id = sc.student_id
    JOIN users u ON u.id = s.user_id
    LEFT JOIN grades g ON g.student_id = s.id AND g.course_id = c.id
    WHERE c.course_name = $1 AND c.start_year = $2 AND c.end_year = $3 AND c.teacher_id = $4
    ORDER BY s.id, g.id;
`;

    const values = [courseName, startYear, endYear, teacherId];

   try{
    const { rows } = await dbClient.query(query, values);

        const studentsMap: Record<number, any> = {};

        for (const row of rows) {
            const {
                student_id, first_name, last_name,
                grade_id, value, title, category, description, created_at
            } = row;

            if (!studentsMap[student_id]) {
                studentsMap[student_id] = {
                    studentId: student_id,
                    name: `${first_name} ${last_name}`,
                    grades: []
                };
            }

            if (grade_id) {
                studentsMap[student_id].grades.push({
                    id: grade_id,
                    value,
                    title,
                    category,
                    description,
                    created_at
                });
            }
        }

        const result = Object.values(studentsMap);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


gradeController.put('/:gradeId', teacherAuthenticationMiddleware, validationMiddleware(GradeDto), async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
    }

    const { gradeId } = req.params;
    const { value, title, category, description } = req.body;

    try {
        const query = `
            UPDATE grades
            SET value = $1, title = $2, category = $3, description = $4
            WHERE id = $5
            RETURNING id, value, title, category, description, created_at;
        `;

        const values = [value, title, category, description, gradeId];
        const { rows } = await dbClient.query(query, values);

        if (rows.length === 0) {
            res.status(404).send({ error: 'Grade not found' });
        }

        res.status(200).send(rows[0]);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});


gradeController.delete('/:id', teacherAuthenticationMiddleware, async (req: Request, res: Response) => {
    const teacherId = req.userId;
    const gradeId = parseInt(req.params.id, 10);

    if (isNaN(gradeId)) {
        res.status(400).send({ error: 'Invalid grade ID' });
        return;
    }

    try {

        const gradeCheckQuery = `
            SELECT g.id 
            FROM grades g
            JOIN courses c ON g.course_id = c.id
            WHERE g.id = $1 AND c.teacher_id = $2
        `;
        const gradeCheckValues = [gradeId, teacherId];
        const { rows } = await dbClient.query(gradeCheckQuery, gradeCheckValues);

        if (rows.length === 0) {
            res.status(404).send({ error: 'Grade not found or you do not have permission to delete it' });
            return;
        }

        const deleteGradeQuery = `
            DELETE FROM grades 
            WHERE id = $1
        `;
        await dbClient.query(deleteGradeQuery, [gradeId]);

        res.status(200).send({ message: 'Grade deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    }
});


gradeController.post('/', teacherAuthenticationMiddleware, validationMiddleware(GradeDto), async (req: Request, res: Response) => {
    const teacherId = req.userId;
    const { studentId, course, value, title, category, description } = req.body;

    if (!teacherId || !studentId || !title) {
        res.status(400).json({ error: "Missing required fields" });
        return
    }

    const [courseName, yearRange] = course.split('$');
    const [startYearStr, endYearStr] = yearRange?.split('-') ?? [];

    const startYear = parseInt(startYearStr, 10);
    const endYear = parseInt(endYearStr, 10);

    if (!courseName || isNaN(startYear) || isNaN(endYear)) {
        res.status(400).json({ error: "Invalid course format" });
        return
    }

    try {
        const courseQuery = `
            SELECT id FROM courses
            WHERE course_name = $1 AND start_year = $2 AND end_year = $3 AND teacher_id = $4
            LIMIT 1;
        `;
        const courseResult = await dbClient.query(courseQuery, [courseName, startYear, endYear, teacherId]);

        if (courseResult.rowCount === 0) {
            res.status(404).json({ error: "Course not found" });
            return
        }

        const courseId = courseResult.rows[0].id;

        const insertQuery = `
            INSERT INTO grades (student_id, course_id, value, title, category, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [studentId, courseId, value, title, category, description || null];

        const insertResult = await dbClient.query(insertQuery, values);
        res.status(201).json(insertResult.rows[0]);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
        return
    }
});

