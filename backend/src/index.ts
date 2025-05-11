import express from 'express';
import cors from 'cors';
import {connectDB, dbClient} from "./config/database";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {loginController} from "./resources/authentication/login.controller";
import {userController} from "./resources/user/user.controller";
import {gradeController} from "./resources/grade/grade.controller";
import {loggerMiddleware} from "./middleware/logger.middleware";
import {teacherController} from "./resources/teacher/teacher.controller";
import {devController} from "./resources/dev/dev.controller";
import {assignmentController} from "./resources/assignment/assignment.controller";
import {courseController} from "./resources/course/course.controller";
import {wheelController} from "./resources/wheel/wheel.controller";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import {swaggerOptions} from "./config/swaggerOptions";

const port = 3000;

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

app.use('/login', loginController);
app.use('/user', userController);
app.use('/grade', gradeController);
app.use('/assignment', assignmentController);
app.use('/teacher', teacherController);
app.use('/dev', devController);
app.use('/course', courseController);
app.use('/wheel', wheelController);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
        console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    })
}).catch(e => {
    console.error(e);
});