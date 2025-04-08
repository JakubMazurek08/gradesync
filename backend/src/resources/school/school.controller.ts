import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const schoolController = express.Router();

schoolController.get("/timetable/:id", authenticationMiddleware, async (req: Request, res: Response) => {

    const requestedId = req.params.id;
    try{
        const result = await dbClient.query(`SELECT timetable FROM schools WHERE id = $1`, [requestedId]);

        let timetable = result.rows[0]?.timetable;

        if(!timetable){
            res.status(400).send("Timetable not found");
        }

        timetable = timetable.split(';').map((lessonTimes:string) => {
            const [start, end] = lessonTimes.split('-');
            return({
                startTime: start,
                endTime: end,
            })
        })

        res.send(timetable);
    }catch(err){
        res.status(500).send({msg:'internal sever error', err:err});
    }
});