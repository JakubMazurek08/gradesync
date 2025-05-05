import express, {Request, Response} from "express";
import {dbClient} from "../config/database";
import {authenticationMiddleware} from "../middleware/authentication.middleware";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export const wheelControler = express.Router();

wheelControler.get('/', async(req: Request, res: Response) => {
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


wheelControler.get('/:id', async(req: Request, res: Response) => {
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


wheelControler.post('/:student_id/:course_id', async(req: Request, res:Response) => {
    try{
        const student = req.params.student_id
        const courses = req.params.course_id

        if(!Number.isInteger(Number(student)) || !Number.isInteger(Number(courses))){
            res.status(400).send('Invalid student_id or course_id')
            return
        }

        const exists = await dbClient.query('SELECT student_id FROM students_courses WHERE student_id = $1', [student])
        const exists2 = await dbClient.query('SELECT course_id FROM students_courses WHERE course_id = $1', [courses])

        if(exists.rows.length === 0){
            res.status(404).send('Student_Id Not Found')
            return
        }
        if(exists2.rows.length === 0){
            res.status(404).send('Course_Id Not Found')
            return
        }

        const check = await dbClient.query('SELECT student_id, course_id FROM students_courses WHERE student_id = $1 AND course_id = $2', [student, courses])

        if(!check.rows[0]){
            await dbClient.query('INSERT INTO students_courses (student_id, course_id) VALUES ($1, $2)', [student, courses])

            const result = await dbClient.query('SELECT student_id, course_id FROM students_courses')
            res.status(201).send({data: result.rows})
        }else{
            res.status(409).send('Student already is on the wheel')
        }
    }catch(err){
        console.log('Error occurred:', err);
        res.status(500).send({ err: err });
    }
})


wheelControler.delete('/:student_id', async (req:Request, res:Response) =>{
    try{
        const student = req.params.student_id

        if(!Number.isInteger(student)){
            res.status(400).send('Invalid student_id')
            return
        }

        const exists = await dbClient.query('SELECT student_id FROM students_courses WHERE student_id = $1', [student])

        if(exists.rows.length === 0){
            res.status(404).send('Student_Id Not Found')
            return
        }

        await dbClient.query('DELETE FROM students_courses WHERE student_id = $1', [student])

        res.status(200).send('Student dropped from wheel')
    }catch(err){
        res.status(500).send({msg:'internal server error',})
    }
})


