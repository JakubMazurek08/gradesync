import express, { Request, Response } from "express";
import { dbClient } from "../../config/database";

export const userController = express.Router();

userController.get("/firstName/:id", async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
    }

    const requestedId = req.params.id;

    try {
        const result = await dbClient.query(
            `SELECT first_name FROM users WHERE id = $1`,
            [requestedId]
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
