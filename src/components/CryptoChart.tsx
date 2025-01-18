import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoHistory } from "@/services/api";
import { Skeleton } from "./ui/skeleton";

interface CryptoChartProps {
  symbol: string;
}

export const CryptoChart = ({ symbol }: CryptoChartProps) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["crypto-history", symbol],
    queryFn: () => fetchCryptoHistory(symbol),
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            stroke="hsl(var(--muted-foreground))"
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <Card className="p-2">
                  <div className="text-sm font-medium">
                    ${data.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(data.timestamp).toLocaleString()}
                  </div>
                </Card>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            fill="url(#gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};