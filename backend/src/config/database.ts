import {Pool, PoolClient} from "pg";
import {ENV} from "./env";

export const dbClient = new Pool({
    host: ENV.DATABASE.PGHOST,
    database: ENV.DATABASE.PGDATABASE,
    user: ENV.DATABASE.PGUSER,
    password: ENV.DATABASE.PGPASSWORD,
    port: 5432,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    },
})


dbClient.on('connect', (_client: PoolClient) => {
    // On each new client initiated, need to register for error(this is a serious bug on pg, the client throw errors although it should not)
    _client.on('error', (err: Error) => {
        console.log(err);
    });
});

export const connectDB = async () => {
    await dbClient.connect();
}
