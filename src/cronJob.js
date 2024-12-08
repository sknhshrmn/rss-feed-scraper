import cron from "node-cron";
import scrapeArticles from "./services/scraper.js";

// Set up the cron job to run every hour
cron.schedule("* * * * *", async () => {
  console.log("Starting scraping articles...");
  await scrapeArticles(); // Call the scraping function
  console.log("Finished scraping articles.");
});
