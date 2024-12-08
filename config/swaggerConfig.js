import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Swagger version
    info: {
      title: "Express API Documentation",
      version: "1.0.0",
      description: "API documentation for my Express app",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Server URL
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to API route files for documentation
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
