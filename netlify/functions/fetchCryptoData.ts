import { Handler } from "@netlify/functions";

const COINMARKETCAP_BASE_URL = "https://pro-api.coinmarketcap.com/v1";
const LISTINGS_URL = `${COINMARKETCAP_BASE_URL}/cryptocurrency/listings/latest`;
const INFO_URL = `${COINMARKETCAP_BASE_URL}/cryptocurrency/info`;

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

    // First, fetch the listings data
    const listingsResponse = await fetch(LISTINGS_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json",
      },
    });

    if (!listingsResponse.ok) {
      const errorText = await listingsResponse.text();
      console.error("Listings API Error Response:", errorText);
      throw new Error(`Listings API responded with status: ${listingsResponse.status}`);
    }

    const listingsData = await listingsResponse.json();
    console.log("Listings data received for", listingsData.data?.length, "cryptocurrencies");

    // Extract IDs for metadata request
    const ids = listingsData.data.map((crypto: any) => crypto.id).join(',');

    // Fetch metadata (including logos) for all cryptocurrencies
    const metadataResponse = await fetch(`${INFO_URL}?id=${ids}`, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json",
      },
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error("Metadata API Error Response:", errorText);
      throw new Error(`Metadata API responded with status: ${metadataResponse.status}`);
    }

    const metadataData = await metadataResponse.json();
    console.log("Metadata received for", Object.keys(metadataData.data || {}).length, "cryptocurrencies");

    // Combine listings and metadata
    const enrichedData = {
      data: listingsData.data.map((crypto: any) => ({
        ...crypto,
        logo: metadataData.data[crypto.id]?.logo,
      })),
    };

    console.log("Sample enriched crypto data:", JSON.stringify(enrichedData.data[0], null, 2));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(enrichedData),
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