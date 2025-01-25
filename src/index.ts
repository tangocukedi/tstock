import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define types for the API response
interface StockData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

// Define the structure of the API response
interface AlphaVantageResponse {
  "Time Series (5min)"?: { [key: string]: StockData };
}

// Base URL for the Alpha Vantage API
const apiKey = process.env.API_KEY;
const baseUrl = "https://www.alphavantage.co/query";

// Function to fetch intraday stock data
async function fetchStockData(symbol: string): Promise<void> {
  if (!apiKey) {
    console.error("API key is missing!");
    return;
  }

  try {
    // Make the API request
    const response = await axios.get<AlphaVantageResponse>(baseUrl, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol: symbol,
        interval: "5min", // You can adjust this interval (1min, 15min, etc.)
        apikey: apiKey,
      },
    });

    // Check if the response contains the time series data
    const data = response.data["Time Series (5min)"];
    if (!data) {
      console.log("Error: No data available or invalid symbol.");
      return;
    }

    // Log the most recent intraday data
    const latestTime = Object.keys(data)[0]; // The latest timestamp
    const stockInfo = data[latestTime];

    console.log(`Latest stock data for ${symbol}:`);
    console.log(`Time: ${latestTime}`);
    console.log(`Open: ${stockInfo["1. open"]}`);
    console.log(`High: ${stockInfo["2. high"]}`);
    console.log(`Low: ${stockInfo["3. low"]}`);
    console.log(`Close: ${stockInfo["4. close"]}`);
    console.log(`Volume: ${stockInfo["5. volume"]}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching stock data:", error.message);
    } else {
    }
  }
}

// Fetch stock data for a symbol (e.g., AAPL for Apple)
fetchStockData("AAPL");
