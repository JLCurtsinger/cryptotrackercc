import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const About = () => {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>How It Works</CardTitle>
        <CardDescription>Understanding our analysis and metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Our platform aggregates real-time data from multiple sources including CoinMarketCap
          to provide you with accurate market insights. We analyze various metrics including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>RSI (Relative Strength Index) for momentum analysis</li>
          <li>Volume trends and market depth</li>
          <li>Buy/Sell pressure indicators</li>
          <li>Historical price patterns and correlations</li>
        </ul>
      </CardContent>
    </Card>
  );
};