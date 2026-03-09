const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Karibu Groceries API",
            version: "1.0.0",
            description: "API documentation for Karibu Groceries Management System"
        },
        servers: [
            {
                url: "https://your-render-url.onrender.com/api"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);