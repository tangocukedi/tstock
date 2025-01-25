export interface StockData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface AlphaVantageResponse {
  "Time Series (5min)"?: { [key: string]: StockData };
}
