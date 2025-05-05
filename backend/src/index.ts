import express from 'express';
import cors from 'cors';
import {connectDB, dbClient} from "./config/database";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {loginController} from "./authentication/login.controller";
import {userController} from "./user/user.controller";
import {gradeController} from "./grade/grade.controller";
import { assignmentsController } from './assignments/assignments.controller';
import { wheelControler } from './wheelOfFortune/wheel.controler';

const port = 3000;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/login', loginController);
app.use('/user', userController);
app.use('/grade', gradeController);
app.use('/assigments', assignmentsController)
app.use('/wheel', wheelControler)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`)
    })
}).catch(e => {
    console.error(e);
});

app.get("/", async (req, res) => {
    try {
        const result = await dbClient.query("SELECT * FROM grade");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});