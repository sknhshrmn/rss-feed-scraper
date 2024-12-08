import express from "express";
import path from "path";
import arcticleRoutes from "./routes/articleRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swaggerConfig.js";
import "../src/cronJob.js";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use("/static", express.static(path.join(process.cwd(), "public")));

// Routes
/**
 * @swagger
 * /example:
 *   get:
 *     summary: Retrieve an example
 *     description: Retrieve an example from the API.
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
});
app.use("/api/article", arcticleRoutes);
app.use("/api/publisher", publisherRoutes);

// Serve Swagger docs at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`
    );
    console.log(
      `Swagger API docs are available at http://localhost:${PORT}/api-docs`
    );
  } else {
    console.error("Error occurred, server can't start", error);
  }
});
