import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Bitcoin, TrendingUp, TrendingDown } from "lucide-react";

const cryptoData = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: 42000, marketCap: "800B", volume: "24B", change: 2.5 },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: 2800, marketCap: "320B", volume: "15B", change: -1.2 },
  { rank: 3, name: "BNB", symbol: "BNB", price: 320, marketCap: "50B", volume: "2B", change: 0.8 },
];

export const CryptoTable = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">24h Volume</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptoData.map((crypto) => (
            <TableRow key={crypto.rank} className="table-row-hover cursor-pointer">
              <TableCell className="font-medium">{crypto.rank}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">{crypto.name}</span>
                <span className="text-muted-foreground">{crypto.symbol}</span>
              </TableCell>
              <TableCell className="text-right">${crypto.price.toLocaleString()}</TableCell>
              <TableCell className="text-right">${crypto.marketCap}</TableCell>
              <TableCell className="text-right">${crypto.volume}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {crypto.change > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">+{crypto.change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">{crypto.change}%</span>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};