import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const symbol = event.queryStringParameters?.symbol;
    if (!symbol) {
      throw new Error("Symbol parameter is required");
    }

    const apiKey = process.env.COINMARKETCAP_API_KEY;
    if (!apiKey) {
      throw new Error("CoinMarketCap API key is not configured");
    }

    // Fetch historical data (last 30 days)
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical?symbol=${symbol}&interval=daily&count=30`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const quotes = Object.values(data.data)[0].quotes;

    const chartData = quotes.map((quote: any) => ({
      timestamp: new Date(quote.timestamp).getTime(),
      price: quote.quote.USD.price,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(chartData),
    };
  } catch (error) {
    console.error("Error in fetchCryptoHistory:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch cryptocurrency history",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };