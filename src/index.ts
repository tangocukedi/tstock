import { StockService } from "./services/stock.service";
import { logger } from "./utils/logger";

const stockService = new StockService();

async function main() {
  try {
    const symbol = "AAPL"; // hardcoded for now
    logger.info(`Fetching stock data for ${symbol}...`);
    await stockService.fetchStockData(symbol);
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "Unknown error");
  }
}

main();
