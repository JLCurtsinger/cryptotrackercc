import { Handler } from "@netlify/functions";

const COINMARKETCAP_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight requests
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
    console.log("API Key present:", !!process.env.COINMARKETCAP_API_KEY);

    const response = await fetch(COINMARKETCAP_API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY || "",
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
    console.log("Successfully fetched data");

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