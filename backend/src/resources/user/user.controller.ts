import express, { Request, Response } from "express";
import { dbClient } from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const userController = express.Router();

userController.get("/firstName", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
        return;
    }

    try {
        const result = await dbClient.query(
            `SELECT first_name FROM users WHERE id = $1`,
            [req.userId]
        );

        const firstName = result.rows[0]?.first_name;


        if (!firstName) {
            res.status(400).send("First name not found");
        }

        res.send({ firstName });
    } catch (err) {
        res.status(500).send({ msg: 'internal server error', err });
    }
});
