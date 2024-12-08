import { PrismaClient } from "@prisma/client";
const BASE_URL = `${process.env.HOST}:${process.env.PORT}`;

const prisma = new PrismaClient();

export const getArticles = async (req, res) => {
  const language = req.query.language ? req.query.language.toUpperCase() : null;

  try {
    // Fetch articles with or without language filter
    const articles = await prisma.rssFeed.findMany({
      where: {
        ...(language ? { language } : {}), // Filter by language if provided
      },
      include: {
        categories: true, // Include related categories
        publisher: true, // Include related publisher
        images: true, // Include related image (assuming you have an image field)
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    // Add default image if no image exists
    const articlesWithImage = articles.map((article) => {
      if (!article.images || !article.images[0]?.url) {
        article.images[0] = {
          url: `${BASE_URL}/static/pexels-xoxoxo-29639772.jpg`, // Use base URL
        }; // Default image
      }
      return article;
    });

    res.status(200).json(articlesWithImage);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
