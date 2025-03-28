import express from 'express';
import cors from 'cors';
import {connectDB, dbClient} from "./config/database";

const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

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