import { Pool, PoolClient } from "pg";
import { ENV } from "./env";

// Create a connection pool with better configuration
export const dbClient = new Pool({
    host: ENV.DATABASE.PGHOST,
    database: ENV.DATABASE.PGDATABASE,
    user: ENV.DATABASE.PGUSER,
    password: ENV.DATABASE.PGPASSWORD,
    port: 5432,
    // Better timeout settings
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Wait up to 10 seconds when connecting
    max: 20, // Maximum number of clients the pool should contain
    // You might also want to add:
    // maxUses: 7500, // Close and replace a connection after it has been used this many times
    ssl: {
        rejectUnauthorized: false,
    },
});

// Error handler for the pool itself
dbClient.on("error", (err: Error) => {
    console.error("Unexpected error on idle client", err);
    // Depending on your application needs, you might want to attempt reconnection here
});

// Event handler for new client connections
dbClient.on("connect", (client: PoolClient) => {
    console.log("New database connection established");
    // Register error handler on each client
    client.on("error", (err: Error) => {
        console.error("Database client error:", err);
    });
});

// Function to test database connection
export const connectDB = async (): Promise<void> => {
    try {
        const client = await dbClient.connect();
        console.log("Database connection successful");
        // Important: Release the client back to the pool
        client.release();
        return;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};
