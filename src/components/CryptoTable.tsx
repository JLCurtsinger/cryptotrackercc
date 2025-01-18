import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoData } from "@/services/api";
import { Skeleton } from "./ui/skeleton";
import Image from "./ui/image";
import { useNavigate } from "react-router-dom";

export const CryptoTable = () => {
  const navigate = useNavigate();
  const { data: cryptoData, isLoading, isError } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCryptoData,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  const handleRowClick = (symbol: string) => {
    navigate(`/cryptos/${symbol.toLowerCase()}`);
  };

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load cryptocurrency data. Please check your API key and try again.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card border-b">
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              cryptoData?.map((crypto) => (
                <TableRow
                  key={crypto.rank}
                  className="table-row-hover cursor-pointer"
                  onClick={() => handleRowClick(crypto.symbol)}
                >
                  <TableCell className="font-medium">{crypto.rank}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Image
                      src={crypto.logo}
                      alt={`${crypto.name} logo`}
                      className="h-5 w-5 object-contain"
                      fallback="/placeholder.svg"
                    />
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-muted-foreground">{crypto.symbol}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">${crypto.marketCap}</TableCell>
                  <TableCell className="text-right">${crypto.volume}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {crypto.change > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">+{crypto.change.toFixed(2)}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">{crypto.change.toFixed(2)}%</span>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};