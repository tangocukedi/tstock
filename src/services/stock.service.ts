import axios from "axios";
import { config } from "../config/config";
import { AlphaVantageResponse } from "../interfaces/stock-data.interface";
import { ApiError } from "../utils/errors";

export class StockService {
  async fetchStockData(symbol: string): Promise<void> {
    const { apiKey, baseUrl } = config;

    if (!apiKey) {
      throw new Error("API key is missing!");
    }

    try {
      const response = await axios.get<AlphaVantageResponse>(baseUrl, {
        params: {
          function: "TIME_SERIES_INTRADAY",
          symbol,
          interval: "5min",
          apikey: apiKey,
        },
      });

      const data = response.data["Time Series (5min)"];
      if (!data) {
        console.error("Error: No data available or invalid symbol.");
        return;
      }

      const latestTime = Object.keys(data)[0];
      const stockInfo = data[latestTime];

      console.log(`Latest stock data for ${symbol}:`);
      console.log(`Time: ${latestTime}`);
      console.log(`Open: ${stockInfo["1. open"]}`);
      console.log(`High: ${stockInfo["2. high"]}`);
      console.log(`Low: ${stockInfo["3. low"]}`);
      console.log(`Close: ${stockInfo["4. close"]}`);
      console.log(`Volume: ${stockInfo["5. volume"]}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(`Failed to fetch stock data: ${error.message}`);
      }
      // Rethrow unexpected errors
      throw error;
    }
  }
}
