import { PrismaClient } from "@prisma/client";

// Create an instance of Prisma Client
const prisma = new PrismaClient();

const truncateTables = async () => {
  // Ensure table names are lowercase to match PostgreSQL naming conventions
  const tables = ["Publisher", "Category", "RssLink"]; // Use lowercase table names

  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
    );
  }

  console.log(
    "Tables Publisher, RSSLink and Category truncated and auto-increment IDs reset."
  );
};

const seed = async () => {
  // First truncate the tables
  await truncateTables();

  // Add Categories
  const foodCategory = await prisma.category.create({
    data: {
      name: "Food",
    },
  });

  const newsCategory = await prisma.category.create({
    data: {
      name: "News",
    },
  });

  const worldCategory = await prisma.category.create({
    data: {
      name: "World",
    },
  });

  // Add Publishers
  const publisher1 = await prisma.publisher.create({
    data: {
      name: "SAYS",
    },
  });

  const publisher2 = await prisma.publisher.create({
    data: {
      name: "Harian Metro",
    },
  });

  const publisher3 = await prisma.publisher.create({
    data: {
      name: "Eat Drink KL",
    },
  });

  // Add Rss Link
  const saysRssLink = await prisma.rssLink.create({
    data: {
      url: "https://says.com/my/rss",
      publisherId: 1,
    },
  });

  const hmetroRssLink1 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/utama.xml",
      publisherId: 2,
    },
  });

  const hmetroRssLink2 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/mutakhir.xml",
      publisherId: 2,
    },
  });

  const hmetroRssLink3 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/bisnes.xml",
      publisherId: 2,
    },
  });

  const hmetroRssLink4 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/arena.xml",
      publisherId: 2,
    },
  });

  const hmetroRssLink5 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/global.xml",
      publisherId: 2,
    },
  });

  const hmetroRssLink6 = await prisma.rssLink.create({
    data: {
      url: "http://www.hmetro.com.my/rap.xml",
      publisherId: 2,
    },
  });

  const eatDrinkKLRssLink = await prisma.rssLink.create({
    data: {
      url: "https://www.eatdrink.my/kl/feed/",
      publisherId: 3,
    },
  });

  console.log("Seeding completed!");
  await prisma.$disconnect();
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
