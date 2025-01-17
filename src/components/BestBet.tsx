import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";

export const BestBet = () => {
  return (
    <Card className="card-gradient border-primary/20">
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
            <span className="font-semibold">Ethereum (ETH)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Price</span>
            <span className="font-semibold">$2,800.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Projected Profit</span>
            <span className="font-semibold text-green-500">+12.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Suggested Hold Time</span>
            <span className="font-semibold">7 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};