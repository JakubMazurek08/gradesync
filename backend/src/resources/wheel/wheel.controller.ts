import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";

export const wheelController = express.Router();

/**
 * @swagger
 * /wheel:
 *   get:
 *     summary: Get a list of all students with their first and last names
 *     tags:
 *       - Wheel
 *     responses:
 *       200:
 *         description: A list of students with their first and last names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *       500:
 *         description: Database query failed
 */
wheelController.get('/', async(req: Request, res: Response) => {
    try {
        const result = await dbClient.query(`SELECT DISTINCT first_name, last_name FROM users as U right join students as S on U.id = S.user_id left join students_courses as SC on S.user_id = SC.student_id right join courses as C on SC.course_id = C.id right join teachers as T on C.teacher_id = T.id WHERE first_name IS NOT NULL AND last_name IS NOT NULL`);
        const filteredData = result.rows.map(row => ({
            first_name: row.first_name,
            last_name: row.last_name
        }))
        res.send({ result: filteredData });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Database query failed:', err: err });
    }
});

/**
 * @swagger
 * /wheel/{id}:
 *   get:
 *     summary: Get students associated with a specific teacher
 *     tags:
 *       - Wheel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Teacher ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of students associated with the teacher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *       400:
 *         description: Students not found
 *       500:
 *         description: Internal server error
 */
wheelController.get('/:id', async(req: Request, res: Response) => {
    try{
        const teacher = req.params.id
        const result = await dbClient.query(`SELECT first_name, last_name FROM users as U right join students as S on U.id = S.user_id left join students_courses as SC on S.user_id = SC.student_id right join courses as C on SC.course_id = C.id right join teachers as T on C.teacher_id = T.id WHERE T.id = '${teacher}' AND first_name IS NOT NULL AND last_name IS NOT NULL`)
        const first_name = result.rows[0]?.first_name;
        if(!first_name){
            res.status(400).send("Students not found")
        }
        res.send({result: result.rows});
    }catch(err){
        res.status(500).send({msg:'internal server error',})
    }
})

/**
 * @swagger
 * /wheel/{student_id}/{course_id}:
 *   post:
 *     tags:
 *       - Wheel
 *     summary: Enroll a student in a course
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: course_id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Student successfully enrolled in the course
 *       400:
 *         description: Invalid student_id or course_id
 *       404:
 *         description: Student or Course not found
 *       409:
 *         description: Student already enrolled in the course
 *       500:
 *         description: Internal server error
 */
wheelController.post('/:student_id/:course_id', async(req: Request, res:Response) => {
    try{
        const student = Number(req.params.student_id);
        const course = Number(req.params.course_id);

        if (isNaN(student) || isNaN(course)) {
            res.status(400).send('Invalid student_id or course_id');
        }

        const existsStudent = await dbClient.query(`SELECT COUNT(*) AS count FROM students WHERE id = $1`, [student]);

        if (Number(existsStudent.rows[0].count) === 0) {
            res.status(404).send('Student_Id Not Found');
        }

        const courseExists = await dbClient.query(`SELECT COUNT(*) AS count FROM courses WHERE id = $1`, [course]);

        if (Number(courseExists.rows[0].count) === 0) {
            res.status(404).send('Course_Id Not Found');
        }

        const check = await dbClient.query(`SELECT student_id, course_id FROM students_courses WHERE student_id = $1 AND course_id = $2`, [student, course])

        if(check.rows.length === 0){
            await dbClient.query(`INSERT INTO students_courses (student_id, course_id) VALUES ($1, $2)`, [student, course])

            const result = await dbClient.query(`SELECT student_id, course_id FROM students_courses`)
            res.status(201).send({data: result.rows})
        }else{
            res.status(409).send('Student already is on the wheel')
        }
    }catch(err){
        console.log('Error occurred:', err);
        res.status(500).send({ err: err });
    }
})

/**
 * @swagger
 * /wheel/{student_id}/{course_id}/{new_student_id}:
 *   put:
 *     summary: Update the student enrolled in a course
 *     tags:
 *       - Wheel
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         description: Current student ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: course_id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: new_student_id
 *         required: true
 *         description: New student ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student successfully replaced in the course
 *       400:
 *         description: Invalid student_id, course_id, or new_student_id
 *       404:
 *         description: Student or Course not found
 *       500:
 *         description: Internal server error
 */
wheelController.put('/:student_id/:course_id/:new_student_id', async(req:Request, res:Response) => {
    try{
        const parsedStudentId = parseInt(req.params.student_id);

        const parsedCourseId = parseInt(req.params.course_id)

        const parsedNewStudentId = parseInt(req.params.new_student_id)


        if(isNaN(parsedStudentId) || isNaN(parsedCourseId) || isNaN(parsedNewStudentId)){
            res.status(400).send('Student_id and course_id and new_student_id must be a number')
        }

        const findId = await dbClient.query(`SELECT student_id FROM students_courses WHERE student_id = $1 AND course_id = $2`, [parsedStudentId, parsedCourseId])

        if(findId.rows.length === 0){
            res.status(404).send('Student_Id or Course_Id Not Found')
        }

        const checkNewStudent = await dbClient.query(`SELECT id from students WHERE id = $1`, [parsedNewStudentId])

        if(checkNewStudent.rows.length === 0){
            res.status(404).send('New student do not exists')
        }

        await dbClient.query(`UPDATE students_courses SET student_id = $1 WHERE course_id = $2 AND student_id = $3`, [parsedNewStudentId, parsedCourseId, parsedStudentId])

        res.status(200).send('Student_Id putted')
    }catch(err){
        res.status(500).send({ error: 'Internal Server Error', details: err});
    }
})

/**
 * @swagger
 * /wheel/{student_id}/{new_student_id}:
 *   patch:
 *     tags:
 *       - Wheel
 *     summary: Update the student enrolled in any course
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         description: Current student ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: new_student_id
 *         required: true
 *         description: New student ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student successfully updated across all courses
 *       400:
 *         description: Invalid student_id or new_student_id
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
wheelController.patch('/:student_id/:new_student_id', async(req:Request, res:Response) => {
    try{
        const parsedStudentId = parseInt(req.params.student_id)
        const parsedNewStudentId = parseInt(req.params.new_student_id)


        if(isNaN(parsedStudentId) || isNaN(parsedNewStudentId)){
            res.status(400).send('Student_id and new_student_id must be a number')
        }

        const findId = await dbClient.query(`SELECT student_id FROM students_courses WHERE student_id = $1`, [parsedStudentId])

        if(findId.rows.length === 0){
            res.status(404).send('Student_Id or Course_Id Not Found')
        }
        const checkNewStudent = await dbClient.query(`SELECT id from students WHERE id = $1`, [parsedNewStudentId])

        if(checkNewStudent.rows.length === 0){
            res.status(404).send('New student do not exists')
        }


        await dbClient.query(`UPDATE students_courses SET student_id = $1 WHERE student_id = $2`, [parsedNewStudentId, parsedStudentId])

        res.status(200).send('Student_Id patched')
    }catch(err){
        res.status(500).send({ error: 'Internal Server Error', details: err});
    }
})

/**
 * @swagger
 * /wheel/{student_id}/{course_id}:
 *   delete:
 *     summary: Remove a student from a course
 *       tags:
 *         - Wheel
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: course_id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student successfully removed from the course
 *       400:
 *         description: Invalid student_id or course_id
 *       404:
 *         description: Student or Course not found
 *       500:
 *         description: Internal server error
 */
wheelController.delete('/:student_id/:course_id', async (req:Request, res:Response) =>{
    try{
        const parsedStudentId = parseInt(req.params.student_id)

        if (isNaN(parsedStudentId)) {
            res.status(400).send('Invalid student_id');
        }

        const parsedCourseId = parseInt(req.params.course_id)

        if (isNaN(parsedCourseId)) {
            res.status(400).send('Invalid course_id');
        }

        const exists = await dbClient.query(`SELECT student_id FROM students_courses WHERE student_id = $1 AND course_id = $2`, [parsedStudentId, parsedStudentId])

        if(exists.rows.length === 0){
            res.status(404).send('Student_Id Not Found')
            return
        }

        await dbClient.query(`DELETE FROM students_courses WHERE student_id = $1 AND course_id = $2`, [parsedStudentId, parsedStudentId])

        res.status(200).send('Student dropped from wheel')
    }catch(err){
        res.status(500).send({msg:'internal server error', err:err})
    }
})