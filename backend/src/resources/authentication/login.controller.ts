import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { ENV } from "../../config/env";
import { dbClient } from "../../config/database";
import { authenticationMiddleware } from "../../middleware/authentication.middleware";
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { RegisterDto } from "./dto/register.dto";
import { validationMiddleware } from "../../middleware/validation.middleware";

export const loginController = express.Router();

const secret = ENV.AUTHENTICATION.SECRET;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 isTeacher:
 *                   type: boolean
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
loginController.post("/", async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;

        const result = await dbClient.query(`SELECT password, id FROM users WHERE login = '${login}'`);
        const userPassword = result.rows[0]?.password;
        const userId = result.rows[0]?.id;

        const teacherResult = await dbClient.query(`SELECT * FROM teachers where user_id=$1`, [userId]);

        if (!userPassword) {
            res.status(404).send();
            return;
        }

        if (!secret) {
            throw new Error();
        }

        bcrypt.compare(password, userPassword, function (err, result) {
            if (result) {
                const token = jwt.sign({ userId }, secret, { expiresIn: "1h" });
                res.cookie("token", token);
                res.status(200).send({ id: userId, isTeacher: teacherResult.rows[0] != null });
            } else {
                res.status(401).send();
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get current user info based on JWT token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully fetched user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 isTeacher:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
loginController.get("/", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "unauthorized" });
        return;
    }
    try {
        const teacherUser = await dbClient.query(`SELECT * FROM teachers where user_id='${req.userId}'`);

        let isTeacher = false;
        if (teacherUser.rows[0]) {
            isTeacher = true;
        }

        res.send({ id: req.userId, isTeacher: isTeacher });
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /login/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - login
 *               - password
 *               - isTeacher
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               login:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *               isTeacher:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
loginController.post("/register", validationMiddleware(RegisterDto), async (req: Request, res: Response) => {
    const { fullName, email, login, password, isTeacher } = req.body;
    if (!fullName || !email || !login || !password) {
        res.status(400).send("bad request");
        return;
    }

    const newUser = plainToInstance(RegisterDto, req.body);

    const [firstName, lastName] = newUser.fullName.split(" ");

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    try {
        const result = await dbClient.query(
            `INSERT INTO users (first_name, last_name, email, login, password)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [firstName, lastName, newUser.email, newUser.login, hashedPassword]
        );

        const userId = result.rows[0].id;

        await dbClient.query(`INSERT INTO ${isTeacher ? "teachers" : "students"} (user_id) VALUES ($1)`, [userId]);

        if (!secret) {
            throw new Error();
        }

        const token = jwt.sign({ userId }, secret, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).send({ id: userId });
    } catch (err) {
        res.status(500).send({ msg: "internal server error", err: err });
    }
});
