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

    // Fetch both quotes and metadata
    const [quotesResponse, metadataResponse] = await Promise.all([
      fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          "Accept": "application/json",
        },
      }),
      fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbol}`, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          "Accept": "application/json",
        },
      }),
    ]);

    if (!quotesResponse.ok || !metadataResponse.ok) {
      throw new Error("Failed to fetch cryptocurrency data");
    }

    const [quotesData, metadataData] = await Promise.all([
      quotesResponse.json(),
      metadataResponse.json(),
    ]);

    const crypto = Object.values(quotesData.data)[0];
    const metadata = Object.values(metadataData.data)[0];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        marketCap: crypto.quote.USD.market_cap,
        volume: crypto.quote.USD.volume_24h,
        change: crypto.quote.USD.percent_change_24h,
        rank: crypto.cmc_rank,
        circulatingSupply: crypto.circulating_supply,
        maxSupply: crypto.max_supply,
        logo: metadata.logo,
        website: metadata.urls?.website?.[0],
        whitepaper: metadata.urls?.technical_doc?.[0],
        github: metadata.urls?.source_code?.[0],
        twitter: metadata.urls?.twitter?.[0],
      }),
    };
  } catch (error) {
    console.error("Error in fetchCryptoDetail:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch cryptocurrency details",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };