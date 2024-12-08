import express from "express";
import { createPublisher } from "../controllers/publisherController.js";

const router = express.Router();
router.use(express.json());
/**
 * @swagger
 * /publisher:
 *   post:
 *     summary: Create a new publisher
 *     description: Adds a new publisher to the database.
 *     tags:
 *       - Publishers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the publisher.
 *                 example: "New Publisher"
 *               rssLinkUrl:
 *                 type: string
 *                 description: RSS feed link of the publisher.
 *                 example: "https://example.com/rss"
 *     responses:
 *       201:
 *         description: Publisher created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created publisher.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the publisher.
 *                   example: "New Publisher"
 *                 rssLinkUrl:
 *                   type: string
 *                   description: The RSS feed link of the publisher.
 *                   example: "https://example.com/rss"
 *       400:
 *         description: Bad Request. Invalid or missing input data.
 *       500:
 *         description: Internal Server Error.
 */
router.post("", createPublisher);

export default router;
