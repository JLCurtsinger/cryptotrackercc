import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { fetchCryptoData } from "@/services/api";

export const BestBet = () => {
  const { data: cryptoData } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCryptoData,
  });

  // Find the crypto with the highest 24h change
  const bestCrypto = cryptoData?.sort((a, b) => b.change - a.change)[0];

  // Calculate projected profit (simplified example)
  const projectedProfit = bestCrypto ? (bestCrypto.change > 0 ? bestCrypto.change * 1.5 : 0) : 0;
  
  // Determine suggested hold time based on current trend
  const getSuggestedHoldTime = (change: number) => {
    if (change > 20) return "2-3 days";
    if (change > 10) return "4-5 days";
    return "7 days";
  };

  // Generate CoinMarketCap URL
  const getCoinMarketCapUrl = (name: string) => {
    return `https://coinmarketcap.com/currencies/${name.toLowerCase().replace(/\s+/g, '-')}/`;
  };

  // If no best crypto is available, render a non-clickable card
  if (!bestCrypto) {
    return (
      <Card className="card-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Best Bet Today
          </CardTitle>
          <CardDescription>Loading best cryptocurrency data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <a
      href={getCoinMarketCapUrl(bestCrypto.name)}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-300"
      aria-label={`View ${bestCrypto.name} on CoinMarketCap`}
    >
      <Card 
        id="best-bet-section" 
        className="card-gradient border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-lg cursor-pointer"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Best Bet Today
          </CardTitle>
          <CardDescription>Based on current market analysis and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Asset</span>
              <span className="font-semibold">{`${bestCrypto.name} (${bestCrypto.symbol})`}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-semibold">
                {`$${bestCrypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Projected Profit</span>
              <span className="font-semibold text-green-500">
                {`+${projectedProfit.toFixed(1)}%`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Suggested Hold Time</span>
              <span className="font-semibold">
                {getSuggestedHoldTime(bestCrypto.change)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};