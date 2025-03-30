import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    DATABASE:{
        PGHOST:process.env.PGHOST,
        PGDATABASE:process.env.PGDATABASE,
        PGUSER:process.env.PGUSER,
        PGPASSWORD:process.env.PGPASSWORD,
    },
    AUTHENTICATION: {
        SECRET: process.env.JWT_SECRET,
    }
}