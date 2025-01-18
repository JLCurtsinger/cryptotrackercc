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

  return (
    <Card id="best-bet-section" className="card-gradient border-primary/20 transition-all duration-300 hover:border-primary/40">
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
            <span className="font-semibold">{bestCrypto ? `${bestCrypto.name} (${bestCrypto.symbol})` : 'Loading...'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Price</span>
            <span className="font-semibold">
              {bestCrypto ? `$${bestCrypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Projected Profit</span>
            <span className="font-semibold text-green-500">
              {bestCrypto ? `+${projectedProfit.toFixed(1)}%` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Suggested Hold Time</span>
            <span className="font-semibold">
              {bestCrypto ? getSuggestedHoldTime(bestCrypto.change) : 'Loading...'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};