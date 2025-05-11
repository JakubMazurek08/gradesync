import express, { Request, Response } from "express";
import { dbClient } from "../../config/database";
import {authenticationMiddleware} from "../../middleware/authentication.middleware";

export const userController = express.Router();

/**
 * @swagger
 * /user/firstName:
 *   get:
 *     summary: Get the first name of the logged-in user.
 *     description: This endpoint returns the first name of the authenticated user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: The first name of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *       401:
 *         description: Unauthorized, user is not logged in
 *       400:
 *         description: First name not found for the user
 *       500:
 *         description: Internal server error
 */
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
