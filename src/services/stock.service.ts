import axios from "axios";
import { config } from "../config/config.js";
import { AlphaVantageResponse } from "../interfaces/stock-data.interface.js";
import { ApiError } from "../utils/errors.js";
import fs from "fs";

export class StockService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    if (!this.apiKey) {
      throw new Error("API key is missing!");
    }
  }

  async fetchStockData(symbol: string): Promise<void> {
    try {
      const response = await axios.get<AlphaVantageResponse>(this.baseUrl, {
        params: {
          function: "TIME_SERIES_INTRADAY",
          symbol,
          interval: "5min",
          apikey: this.apiKey,
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
      throw error;
    }
  }

  async fetchBTCtoUSD(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          function: "CURRENCY_EXCHANGE_RATE",
          from_currency: "BTC",
          to_currency: "USD",
          apikey: this.apiKey,
        },
      });
      const exchangeRateData = response.data["Realtime Currency Exchange Rate"];
      if (!exchangeRateData) {
        throw new ApiError("Failed to fetch Bitcoin to USD exchange rate.");
      }

      const rate = parseFloat(exchangeRateData["5. Exchange Rate"]);
      const formattedRate = Math.ceil(rate).toLocaleString("en-US");
      const logEntry = `[${new Date().toISOString()}] BTC/USD: ${formattedRate}\n`;

      // Log to console
      console.log(logEntry);

      // Append to a log file
      fs.appendFileSync("btc-price.log", logEntry, "utf8");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(`Failed to fetch Bitcoin price: ${error.message}`);
      }
      throw error;
    }
  }
}
