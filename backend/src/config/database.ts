import {Pool} from "pg";
import {ENV} from "./env";

export const dbClient = new Pool({
    host: ENV.DATABASE.PGHOST,
    database: ENV.DATABASE.PGDATABASE,
    user: ENV.DATABASE.PGUSER,
    password: ENV.DATABASE.PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
})

export const connectDB = async () => {
    await dbClient.connect();
}
