import express, {Request, Response} from "express";
import {dbClient} from "../../config/database";
import {ENV} from "../../config/env";
import fs from 'fs';
import path from 'path';



export const devController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;


/**
 * @swagger
 * /dev/reset:
 *   get:
 *     summary: Reset the database
 *     description: This endpoint allows for the resetting of the database. The request must include a password for authentication.
 *     tags:
 *       - Development
 *     parameters:
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: The password required to reset the database.
 *     responses:
 *       200:
 *         description: Database reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database reset successfully."
 *       403:
 *         description: Forbidden - Invalid password
 *       500:
 *         description: Internal server error
 */
devController.get('/reset', async (req:Request, res:Response) => {
    if(req.body.password != secret){
        res.status(403).send('forbidden');
    }

    try{
        const resetDatabaseQuery = fs.readFileSync(path.join(__dirname, '../../lib/resetDatabase.sql'), 'utf-8');

        const result = await dbClient.query(resetDatabaseQuery);
        res.send({message: 'Database reset successfully.'});
    }catch(err){
        res.status(500).send({msg:'Internal server error', err:err});
    }
});
