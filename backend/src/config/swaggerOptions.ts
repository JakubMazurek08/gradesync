export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gradesync',
            version: '1.0.0',
            description: 'API documentation for gradesync backend',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['src/resources/**/*.ts']  // if run from root with ts-node or transpiled JS
};