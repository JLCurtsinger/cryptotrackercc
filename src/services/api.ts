import { toast } from "sonner";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const CACHE_KEY = "crypto_data_cache";

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: string;
  volume: string;
  change: number;
  rank: number;
  logo: string;
}

export interface CryptoDetailData extends Omit<CryptoData, 'marketCap' | 'volume'> {
  marketCap: number;
  volume: number;
  circulatingSupply: number;
  maxSupply: number;
  website?: string;
  whitepaper?: string;
  github?: string;
  twitter?: string;
  fullyDilutedMarketCap: number;
  marketCapChange24h: number;
  volumeMarketCapRatio: number;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
  return marketCap.toString();
};

const getCachedData = (): { timestamp: number; data: CryptoData[] } | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

const setCachedData = (data: CryptoData[]) => {
  const cacheData = {
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  const cached = getCachedData();
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Returning cached data");
    return cached.data;
  }

  try {
    console.log("Fetching fresh data from API");
    const response = await fetch("/api/fetchCryptoData");
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response format:", data);
      throw new Error("Invalid API response format");
    }

    const formattedData: CryptoData[] = data.data.map((coin: any) => {
      console.log("Processing coin:", coin.symbol, "logo:", coin.logo);
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.quote.USD.price,
        marketCap: formatMarketCap(coin.quote.USD.market_cap),
        volume: formatMarketCap(coin.quote.USD.volume_24h),
        change: coin.quote.USD.percent_change_24h,
        rank: coin.cmc_rank,
        logo: coin.logo || '/placeholder.svg'
      };
    });

    console.log("Formatted first crypto:", formattedData[0]);
    setCachedData(formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    toast.error("Failed to fetch cryptocurrency data. Please try again later.");
    throw error;
  }
};

export const fetchCryptoDetail = async (symbol: string): Promise<CryptoDetailData> => {
  console.log("Fetching crypto detail for symbol:", symbol);
  try {
    const response = await fetch(`/api/fetchCryptoDetail?symbol=${symbol}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log("Received crypto detail data:", data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching crypto detail:", error);
    throw error;
  }
};

export const fetchCryptoHistory = async (symbol: string): Promise<ChartDataPoint[]> => {
  try {
    const response = await fetch(`/api/fetchCryptoHistory?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto history:", error);
    toast.error("Failed to fetch price history");
    throw error;
  }
};
