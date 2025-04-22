import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const attendanceController = express.Router();


attendanceController.get('/courses', authenticationMiddleware, async (request: Request, response: Response) => {
    if(!request.userId){
        response.status(401).send({error: "unauthorized"});
    }

    try {
        const result = await dbClient.query(`
        `);

        if (result.rows.length > 0) {
            response.send(result.rows);
        } else {
            response.status(404).send();
        }
    }
    catch (error) {
        response.status(500).send({message: 'internal server error', error: error});
    }
})