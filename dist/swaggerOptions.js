"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BACKEND API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: `http://localhost:3001`,
            },
        ],
        components: {
            securitySchemes: {
                jwt: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT"
                },
            }
        },
        security: [{
                jwt: []
            }]
    },
    apis: ['./src/routes/*.ts'],
};
