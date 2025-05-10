import express, {Request, Response} from "express";
import {dbClient} from "../config/database";
import {authenticationMiddleware} from "../middleware/authentication.middleware";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export const wheelController = express.Router();

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


