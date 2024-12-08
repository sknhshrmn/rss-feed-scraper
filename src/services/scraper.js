import { PrismaClient } from "@prisma/client";
import parser from "rss-parser";
const prisma = new PrismaClient();

const scrapeArticles = async () => {
  try {
    // Fetch all publishers from the database
    const rssLinks = await prisma.rssLink.findMany({
      include: {
        publisher: true, // Eager load rssLink
      },
    });

    for (const rssLink of rssLinks) {
      const publisher = rssLink.publisher || null;
      try {
        if (rssLink.url && publisher) {
          const feed = await fetchFeed(rssLink.url);

          if (feed && feed.items?.length > 0) {
            for (const item of feed.items) {
              // Insert or update articles, then handle images
              const article = await upsertArticle(item, publisher);
              await handleImages(item, article); // Now calling after article is processed
            }
          } else {
            console.log(`No items found in feed for ${publisher.name}`);
            continue; // Skip the current iteration and proceed to the next RSS feed
          }
        } else {
          console.log(`No RSS link found for publisher ${publisher.name}`);
          continue; // Skip the current iteration and proceed to the next RSS feed
        }
      } catch (err) {
        console.error(
          `Error fetching or parsing feed for ${rssLink.publisher.name}:`,
          err
        );
        continue; // Skip the current iteration and proceed to the next RSS feed
      }
    }
  } catch (err) {
    console.error("Error scraping articles:", err);
  }
};

// Function to fetch RSS feed
const fetchFeed = async (rssUrl) => {
  const parserInstance = new parser();
  try {
    const feed = await parserInstance.parseURL(rssUrl);
    return feed;
  } catch (err) {
    console.error("Error fetching RSS feed:", err);
    return null;
  }
};

// Function to insert or update articles in the database
const upsertArticle = async (item, publisher) => {
  try {
    // Handle default category for specific publishers
    let publishedCategories = publisher.id === 3 ? [{ id: 1 }] : [];
    if (item.contentSnippet.match(/\b(?!Malaysia\b)[A-Za-z]+\b/)) {
      // A basic regex for detecting country names except Malaysia
      publishedCategories.push({ id: 3 }); // World Category
    } else {
      publishedCategories.push({ id: 2 }); // (Local) News Category
    }

    // Resolve categories dynamically if available
    if (item.categories && item.categories.length > 0) {
      // Split categories if they are comma-separated
      const categoryNames = item.categories.flatMap(
        (category) => category.split(",").map((cat) => cat.trim()) // Split by commas and trim extra spaces
      );

      // Resolve categories asynchronously
      const resolvedCategories = await Promise.all(
        categoryNames.map(async (categoryName) => {
          const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName },
          });
          return { id: category.id }; // Return category id for connection
        })
      );

      // Add resolved categories to the publishedCategories array
      publishedCategories = [...publishedCategories, ...resolvedCategories];
    }

    // Upsert the article with categories
    const article = await prisma.rssFeed.upsert({
      where: { link: item.link },
      update: {
        title: item.title,
        author: item.author || "Unknown",
        content: item.contentSnippet || null,
        language: item.language || "EN",
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        categories: {
          connect: publishedCategories,
        },
        publisher: { connect: { id: publisher.id } },
      },
      create: {
        title: item.title,
        link: item.link,
        author: item.author || "Unknown",
        content: item.contentSnippet || null,
        language: item.language || "EN",
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        categories: {
          connect: publishedCategories,
        },
        publisher: { connect: { id: publisher.id } },
      },
    });

    console.log(`Article "${article.title}" processed successfully.`);
    return article; // Return the article object for later use (e.g., handling images)
  } catch (err) {
    console.error("Error saving article:", err);
  }
};

// Function to handle images and store them in the database
const handleImages = async (item, article) => {
  try {
    const content = item["content:encoded"] || ""; // Ensure content exists

    // Use regex to find the first image URL from the content:encoded field
    const imageUrlMatch = content.match(/<img[^>]+src="([^">]+)"/);

    // If an image URL is found, use it, else fallback to a default static image
    let imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

    if (imageUrl) {
      // Check if the image already exists in the database
      const existingImage = await prisma.image.findUnique({
        where: {
          url: imageUrl, // Look for existing image with this URL
        },
      });

      if (!existingImage) {
        // Only create an image if it does not already exist
        await prisma.image.create({
          data: {
            url: imageUrl,
            type: "main", // You can adjust the type if you want to differentiate
            rssFeedId: article.id, // Associate the image with the article
          },
        });
        console.log(`Image for "${article.title}" processed successfully.`);
      }
      return existingImage;
    } else {
      console.log(`No main image found for "${article.title}".`);
    }
  } catch (err) {
    console.error("Error handling image:", err);
  }
};

export default scrapeArticles;
