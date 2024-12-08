import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPublisher = async (req, res) => {
  const { name, rssLinkUrl } = req.body;

  try {
    // Check if publisher already exists
    const existingPublisher = await prisma.publisher.findUnique({
      where: { name },
    });

    if (existingPublisher) {
      // Check if the RSS link already exists for this publisher
      const existingRSSLink = await prisma.rssLink.findUnique({
        where: { url: rssLinkUrl },
      });

      if (existingRSSLink) {
        return res
          .status(400)
          .json({ message: "Publisher with the RSS link already exists" });
      }

      // Connect to the existing publisher and create the new RSS link
      const rssLink = await prisma.rssLink.create({
        data: {
          url: rssLinkUrl, // RSS link URL
          publisher: {
            connect: {
              id: existingPublisher.id, // Connect the existing publisher to the rssLink
            },
          },
        },
      });

      return res.status(201).json({ publisher: existingPublisher, rssLink });
    }

    // Step 1: If publisher does not exist, create the publisher
    const publisher = await prisma.publisher.create({
      data: {
        name, // Publisher name
      },
    });

    // Step 2: Create the rssLink and associate it with the created Publisher
    const rssLink = await prisma.rssLink.create({
      data: {
        url: rssLinkUrl, // RSS link URL
        publisher: {
          connect: {
            id: publisher.id, // Connect the newly created Publisher to the rssLink
          },
        },
      },
    });

    res.status(201).json({ publisher, rssLink });
  } catch (error) {
    console.error("Error adding publisher:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
