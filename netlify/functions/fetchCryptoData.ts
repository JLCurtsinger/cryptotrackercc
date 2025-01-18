import { Handler } from "@netlify/functions";

const COINMARKETCAP_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    console.log("Starting fetchCryptoData function");
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    console.log("API Key present:", !!apiKey);

    if (!apiKey) {
      throw new Error("CoinMarketCap API key is not configured");
    }

    const response = await fetch(COINMARKETCAP_API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json",
      },
    });

    console.log("API Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response structure:", JSON.stringify(Object.keys(data)));
    console.log("First crypto data sample:", JSON.stringify(data.data?.[0], null, 2));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in fetchCryptoData:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to fetch cryptocurrency data",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};

export { handler };