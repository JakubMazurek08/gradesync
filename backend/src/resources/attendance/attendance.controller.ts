import express, { Request, Response } from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";
import {teacherAuthenticationMiddleware} from "../../middleware/teacherValidation.middleware";


export const attendanceController = express.Router();


attendanceController.get('/', authenticationMiddleware, async (request: Request, response: Response) => {
    if(!request.userId){
        response.status(401).send({error: "unauthorized"});
        return;
    }

    try {
        console.log("User ID:", request.userId);
        const result = await dbClient.query(`
            SELECT 
            a.id AS "attendanceId",
            a.date AS "date",
            a.status AS "status",
            c.course_name AS "courseName",
            d.lesson_hour AS "lessonHour",
            d.day_of_the_week AS "dayOfWeek",
            tu.first_name AS "teacherFirstName",
            tu.last_name AS "teacherLastName"
            FROM students s
            JOIN attendance a ON s.id = a.student_id
            JOIN users u ON s.user_id = u.id
            JOIN days d ON 
            EXTRACT(DOW FROM a.date) = d.day_of_the_week
            JOIN courses c ON d.course_id = c.id
            JOIN teachers t ON c.teacher_id = t.id
            JOIN users tu ON t.user_id = tu.id
            WHERE s.user_id = $1
            ORDER BY a.date DESC, d.lesson_hour ASC`,
            [request.userId]
        );

        if (result.rows.length > 0) {
            response.send(result.rows);
        } else {
            response.status(404).send({message: "No attendance records found"});
        }
    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error});
    }
});

attendanceController.get('/sum', authenticationMiddleware, async (request: Request, response: Response) => {
    if (!request.userId) {
        response.status(401).send({error: "unauthorized"});
        return;
    }

    try {
        const result = await dbClient.query(`
        SELECT
            COUNT(a.id) AS "totalRecords",
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS "presentCount",
            SUM(CASE WHEN a.status = 'absent_unexcused' THEN 1 ELSE 0 END) AS "absentUnexcusedCount",
            SUM(CASE WHEN a.status = 'absent_excused' THEN 1 ELSE 0 END) AS "absentExcusedCount",
            SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS "lateCount"
            FROM students s
            JOIN attendance a ON s.id = a.student_id
            WHERE s.user_id = $1`,
            [request.userId]
        );
        response.send(result.rows[0]);
    } catch (error) {
        response.status(500).send({message: 'internal server error', error: error})
    }
})

attendanceController.post('/student', teacherAuthenticationMiddleware, async (request: Request, response: Response) => {
    const { studentId, date, status } = request.body;

    if (!studentId || !date || !status) {
        response.status(400).send({ error: "studentId, date and status are required" });
        return;
    }

    const validStatuses = ['present', 'absent_excused', 'absent_unexcused', 'late'];
    if (!validStatuses.includes(status)) {
        response.status(400).send({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        return;
    }

    try {
        const result = await dbClient.query(`
            INSERT INTO attendance (student_id, date, status)
            VALUES ($1, $2, $3)
            RETURNING id AS "attendanceId", student_id AS "studentId", date, status
        `, [studentId, date, status]);

        response.status(201).send(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'internal server error', error });
    }
});

attendanceController.post('/multiplyattendance', teacherAuthenticationMiddleware, async (request: Request, response: Response) => {
    const { attendanceRecords, date, courseId } = request.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords) || !date || !courseId) {
        response.status(400).send({
            error: "Invalid request format. Required: attendanceRecords array, date, and courseId"
        });
        return;
    }

    const validStatuses = ['present', 'absent_excused', 'absent_unexcused', 'late'];

    for (const record of attendanceRecords) {
        if (!record.studentId || !record.status) {
            response.status(400).send({
                error: "Each attendance record must contain studentId and status"
            });
            return;
        }

        if (!validStatuses.includes(record.status)) {
            response.status(400).send({
                error: `Invalid status for student ${record.studentId}. Must be one of: ${validStatuses.join(", ")}`
            });
            return;
        }
    }

    try {
        const courseAccess = await dbClient.query(`
            SELECT c.id 
            FROM courses c
            JOIN teachers t ON c.teacher_id = t.id
            WHERE c.id = $1 AND t.user_id = $2
        `, [courseId, request.userId]);

        if (courseAccess.rows.length === 0) {
            response.status(403).send({ error: "You don't have permission to record attendance for this course" });
            return;
        }

        const studentIds = attendanceRecords.map(record => record.studentId);
        const enrollmentCheck = await dbClient.query(`
            SELECT student_id
            FROM grades
            WHERE course_id = $1 AND student_id = ANY($2::int[])
        `, [courseId, studentIds]);


        const foundStudentIds = new Set(enrollmentCheck.rows.map(r => parseInt(r.student_id)));
        const missingStudents = studentIds.filter(id => !foundStudentIds.has(id));

        if (missingStudents.length > 0) {
            response.status(400).send({ error: "Some students are not enrolled in this course", missingStudents });
            return;
        }

        const insertPromises = attendanceRecords.map(record => {
            return dbClient.query(`
                INSERT INTO attendance (student_id, date, status)
                VALUES ($1, $2, $3)
                ON CONFLICT (student_id, date) 
                DO UPDATE SET status = $3
                RETURNING id AS "attendanceId", student_id AS "studentId", date, status
            `, [record.studentId, date, record.status]);
        });

        const results = await Promise.all(insertPromises);

        const insertedRecords = results.map(result => result.rows[0]);
        response.status(201).send({
            message: `Successfully recorded attendance for ${insertedRecords.length} students`,
            date: date,
            courseId: courseId,
            records: insertedRecords
        });

    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Internal server error', error });
    }
});

attendanceController.patch('/lesson', teacherAuthenticationMiddleware, async (request: Request, response: Response) => {
    const { courseId, date, studentAttendance } = request.body;

    if (!courseId || !date || !studentAttendance || !Array.isArray(studentAttendance)) {
        response.status(400).send({
            error: "courseId, date, and studentAttendance array are required"
        });
        return;
    }

    const validStatuses = ['present', 'absent_excused', 'absent_unexcused', 'late'];

    for (const record of studentAttendance) {
        if (!record.studentId || !record.status) {
            response.status(400).send({
                error: "Each attendance record must contain studentId and status"
            });
            return;
        }

        if (!validStatuses.includes(record.status)) {
            response.status(400).send({
                error: `Invalid status for student ${record.studentId}. Must be one of: ${validStatuses.join(", ")}`
            });
            return;
        }
    }

    try {
        const courseAccess = await dbClient.query(`
            SELECT c.id 
            FROM courses c
            JOIN teachers t ON c.teacher_id = t.id
            WHERE c.id = $1 AND t.user_id = $2
        `, [courseId, request.userId]);

        if (courseAccess.rows.length === 0) {
            response.status(403).send({ error: "You don't have permission to update attendance for this course" });
            return;
        }

        const studentIds = studentAttendance.map(record => record.studentId);
        const enrollmentCheck = await dbClient.query(`
            SELECT student_id
            FROM grades
            WHERE course_id = $1 AND student_id = ANY($2::int[])
        `, [courseId, studentIds]);

        console.log("Course ID:", courseId);
        console.log("Student IDs:", studentIds);
        console.log("Enrollment check rows:", enrollmentCheck.rows.map(r => r.student_id));


        const enrolledStudentIds = [...new Set(enrollmentCheck.rows.map(r => r.student_id))];

        if (enrolledStudentIds.length !== studentIds.length) {
            const missing = studentIds.filter(id => !enrolledStudentIds.includes(id));
            console.log("Missing student IDs:", missing);
            response.status(400).send({ error: "Some students are not enrolled in this course" });
            return;
        }


        const updateResults = [];

        for (const record of studentAttendance) {
            const existingRecord = await dbClient.query(`
                SELECT id FROM attendance 
                WHERE student_id = $1 AND date = $2
            `, [record.studentId, date]);

            let result;

            if (existingRecord.rows.length > 0) {
                result = await dbClient.query(`
                    UPDATE attendance 
                    SET status = $1 
                    WHERE id = $2
                    RETURNING id AS "attendanceId", student_id AS "studentId", date, status
                `, [record.status, existingRecord.rows[0].id]);
            } else {
                result = await dbClient.query(`
                    INSERT INTO attendance (student_id, date, status)
                    VALUES ($1, $2, $3)
                    RETURNING id AS "attendanceId", student_id AS "studentId", date, status
                `, [record.studentId, date, record.status]);
            }

            updateResults.push(result.rows[0]);
        }

        response.status(200).send({
            message: `Successfully updated attendance for ${updateResults.length} students`,
            date: date,
            courseId: courseId,
            records: updateResults
        });

    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Internal server error', error });
    }
});

attendanceController.delete('/lesson', teacherAuthenticationMiddleware, async (request: Request, response: Response) => {
    const { courseId, date, studentIds } = request.body;

    if (!courseId || !date || !studentIds || !Array.isArray(studentIds)) {
        response.status(400).send({
            error: "courseId, date, and studentIds array are required"
        });
        return;
    }

    try {
        const courseAccess = await dbClient.query(`
            SELECT c.id 
            FROM courses c
            JOIN teachers t ON c.teacher_id = t.id
            WHERE c.id = $1 AND t.user_id = $2
        `, [courseId, request.userId]);

        if (courseAccess.rows.length === 0) {
            response.status(403).send({ error: "You don't have permission to delete attendance for this course" });
            return;
        }

        const enrollmentCheck = await dbClient.query(`
            SELECT student_id 
            FROM enrollments 
            WHERE course_id = $1 AND student_id = ANY($2::int[])
        `, [courseId, studentIds]);

        console.log("Course ID:", courseId);
        console.log("Student IDs:", studentIds);
        console.log("Enrollment check rows:", enrollmentCheck.rows.map(r => r.student_id));


        if (enrollmentCheck.rows.length !== studentIds.length) {
            response.status(400).send({ error: "Some students are not enrolled in this course" });
            return;
        }

        const attendanceRecords = await dbClient.query(`
            SELECT id, student_id, date, status
            FROM attendance
            WHERE student_id = ANY($1::int[]) AND date = $2
        `, [studentIds, date]);

        if (attendanceRecords.rows.length === 0) {
            response.status(404).send({ message: "No attendance records found for the specified students and date" });
            return;
        }

        const attendanceIds = attendanceRecords.rows.map(record => record.id);

        await dbClient.query(`
            DELETE FROM attendance_comments
            WHERE attendance_id = ANY($1::int[])
        `, [attendanceIds]);

        const deleteResult = await dbClient.query(`
            DELETE FROM attendance
            WHERE student_id = ANY($1::int[]) AND date = $2
            RETURNING id, student_id, date
        `, [studentIds, date]);

        response.status(200).send({
            message: `Successfully deleted attendance records for ${deleteResult.rows.length} students`,
            date: date,
            courseId: courseId,
            deletedRecords: deleteResult.rows
        });

    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Internal server error', error });
    }
});
