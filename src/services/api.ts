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
  // Check cache first
  const cached = getCachedData();
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch("/api/fetchCryptoData");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const formattedData: CryptoData[] = data.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      marketCap: formatMarketCap(coin.quote.USD.market_cap),
      volume: formatMarketCap(coin.quote.USD.volume_24h),
      change: coin.quote.USD.percent_change_24h,
      rank: coin.cmc_rank,
    }));

    setCachedData(formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    toast.error("Failed to fetch cryptocurrency data");
    throw error;
  }
};