import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  console.log("fetchCryptoDetail function called with params:", event.queryStringParameters);
  
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
    const symbol = event.queryStringParameters?.symbol?.toUpperCase();
    if (!symbol) {
      throw new Error("Symbol parameter is required");
    }

    const apiKey = process.env.COINMARKETCAP_API_KEY;
    if (!apiKey) {
      throw new Error("CoinMarketCap API key is not configured");
    }

    console.log(`Fetching data for symbol: ${symbol}`);

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

    console.log("Quotes response status:", quotesResponse.status);
    console.log("Metadata response status:", metadataResponse.status);

    if (!quotesResponse.ok || !metadataResponse.ok) {
      const quotesText = await quotesResponse.text();
      const metadataText = await metadataResponse.text();
      console.error("Quotes response:", quotesText);
      console.error("Metadata response:", metadataText);
      throw new Error(`Failed to fetch cryptocurrency data: Quotes(${quotesResponse.status}), Metadata(${metadataResponse.status})`);
    }

    const [quotesData, metadataData] = await Promise.all([
      quotesResponse.json(),
      metadataResponse.json(),
    ]);

    console.log("Successfully parsed API responses");

    if (!quotesData.data || !metadataData.data) {
      console.error("Invalid API response format:", { quotesData, metadataData });
      throw new Error("Invalid API response format");
    }

    const cryptoQuote = Object.values(quotesData.data)[0] as any;
    const cryptoMetadata = Object.values(metadataData.data)[0] as any;

    if (!cryptoQuote || !cryptoMetadata) {
      console.error("No data found for symbol:", symbol);
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    const responseData = {
      id: cryptoQuote.id,
      name: cryptoQuote.name,
      symbol: cryptoQuote.symbol,
      price: cryptoQuote.quote.USD.price,
      marketCap: cryptoQuote.quote.USD.market_cap,
      volume: cryptoQuote.quote.USD.volume_24h,
      change: cryptoQuote.quote.USD.percent_change_24h,
      rank: cryptoQuote.cmc_rank,
      circulatingSupply: cryptoQuote.circulating_supply,
      maxSupply: cryptoQuote.max_supply,
      logo: cryptoMetadata.logo,
      website: cryptoMetadata.urls?.website?.[0],
      whitepaper: cryptoMetadata.urls?.technical_doc?.[0],
      github: cryptoMetadata.urls?.source_code?.[0],
      twitter: cryptoMetadata.urls?.twitter?.[0],
      fullyDilutedMarketCap: cryptoQuote.quote.USD.fully_diluted_market_cap,
      marketCapChange24h: cryptoQuote.quote.USD.market_cap_change_24h,
      volumeMarketCapRatio: cryptoQuote.quote.USD.volume_24h / cryptoQuote.quote.USD.market_cap,
    };

    console.log("Sending response for symbol:", symbol);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
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