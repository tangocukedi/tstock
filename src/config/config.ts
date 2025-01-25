import dotenv from "dotenv";

dotenv.config();

export const config = {
  apiKey: process.env.API_KEY || "",
  baseUrl: "https://www.alphavantage.co/query",
};
