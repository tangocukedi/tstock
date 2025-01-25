import { StockService } from "./services/stock.service.js";
import { CronJob } from "cron";

const stockService = new StockService();
const cronInterval = process.env.CRON_INTERVAL || "*/5 * * * *";

async function main() {
  console.log("Starting stock/currency price data");

  const job = CronJob.from({
    cronTime: cronInterval,
    onTick: async () => {
      try {
        console.log(`[${new Date().toISOString()}] Fetching Bitcoin price...`);
        await stockService.fetchBTCtoUSD();
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error fetching Bitcoin price:`,
          error
        );
      }
    },
    start: true,
    timeZone: "America/New_York",
  });
}

main().catch((error) => {
  console.error("Error starting the app:", error);
  process.exit(1);
});
