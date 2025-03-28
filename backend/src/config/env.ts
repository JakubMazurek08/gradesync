import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT ?? 3000,
    DATABASE:{
        PGHOST:process.env.PGHOST,
        PGDATABASE:process.env.PGDATABASE,
        PGUSER:process.env.PGUSER,
        PGPASSWORD:process.env.PGPASSWORD,
    },
}