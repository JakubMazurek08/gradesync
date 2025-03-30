import express from 'express';
import cors from 'cors';
import {connectDB, dbClient} from "./config/database";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {loginController} from "./authentication/login.controller";

const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/login', loginController);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`)
    })
}).catch(e => {
    console.error(e);
});

app.get("/", async (req, res) => {

    try {
        const result = await dbClient.query("SELECT * FROM grades");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});