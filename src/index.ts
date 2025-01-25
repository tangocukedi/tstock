import { StockService } from "./services/stock.service.js";
import { logger } from "./utils/logger.js";

const stockService = new StockService();

async function main() {
  try {
    const symbol = "BTC/USD"; // hardcoded for now
    logger.info(`Fetching stock data for ${symbol}...`);
    await stockService.fetchBTCtoUSD();
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "Unknown error");
  }
}

main();
