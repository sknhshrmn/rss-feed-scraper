import express from "express";
import { getArticles } from "../controllers/articleController.js";

const router = express.Router();

/**
 * @swagger
 * /article:
 *   get:
 *     summary: Retrieve a list of articles
 *     description: Fetches all articles available in the database, optionally filtered by language.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         description: Language of the articles to filter by.
 *         schema:
 *           type: string
 *           example: "en"
 *     responses:
 *       200:
 *         description: A list of articles, optionally filtered by language.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The article ID.
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: The title of the article.
 *                     example: "Breaking News"
 *                   content:
 *                     type: string
 *                     description: The content of the article.
 *                     example: "This is a sample article."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The time the article was created.
 *                     example: "2024-12-08T12:00:00Z"
 *       500:
 *         description: Internal Server Error.
 */
router.get("", getArticles);

export default router;
