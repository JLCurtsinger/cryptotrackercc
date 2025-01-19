import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoData } from "@/services/api";
import { Skeleton } from "./ui/skeleton";
import Image from "./ui/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState, useMemo } from "react";

type SortField = 'rank' | 'name' | 'price' | 'marketCap' | 'volume' | 'change';
type SortDirection = 'asc' | 'desc';

export const CryptoTable = () => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: cryptoData, isLoading, isError } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCryptoData,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Generate CoinMarketCap URL
  const getCoinMarketCapUrl = (name: string) => {
    return `https://coinmarketcap.com/currencies/${name.toLowerCase().replace(/\s+/g, '-')}/`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const sortedData = useMemo(() => {
    if (!cryptoData) return [];
    
    return [...cryptoData].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'rank':
          return (a.rank - b.rank) * multiplier;
        case 'name':
          return a.name.localeCompare(b.name) * multiplier;
        case 'price':
          return (a.price - b.price) * multiplier;
        case 'marketCap':
          return (parseFloat(a.marketCap.replace(/[^0-9.-]+/g, "")) - 
                 parseFloat(b.marketCap.replace(/[^0-9.-]+/g, ""))) * multiplier;
        case 'volume':
          return (parseFloat(a.volume.replace(/[^0-9.-]+/g, "")) - 
                 parseFloat(b.volume.replace(/[^0-9.-]+/g, ""))) * multiplier;
        case 'change':
          return (a.change - b.change) * multiplier;
        default:
          return 0;
      }
    });
  }, [cryptoData, sortField, sortDirection]);

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load cryptocurrency data. Please check your API key and try again.
      </div>
    );
  }

  const renderSortableHeader = (label: string, field: SortField) => (
    <div
      className="flex items-center cursor-pointer select-none"
      onClick={() => handleSort(field)}
      role="button"
      tabIndex={0}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {getSortIcon(field)}
    </div>
  );

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card border-b">
            <TableRow>
              <TableHead className="w-[80px]">
                {renderSortableHeader('Rank', 'rank')}
              </TableHead>
              <TableHead>
                {renderSortableHeader('Asset', 'name')}
              </TableHead>
              <TableHead className="text-right">
                {renderSortableHeader('Price', 'price')}
              </TableHead>
              <TableHead className="text-right">
                {renderSortableHeader('Market Cap', 'marketCap')}
              </TableHead>
              <TableHead className="text-right">
                {renderSortableHeader('24h Volume', 'volume')}
              </TableHead>
              <TableHead className="text-right">
                {renderSortableHeader('24h Change', 'change')}
              </TableHead>
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
              sortedData.map((crypto) => (
                <TooltipProvider key={crypto.rank}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow
                        className="table-row-hover cursor-pointer"
                        onClick={() => window.open(getCoinMarketCapUrl(crypto.name), '_blank', 'noopener,noreferrer')}
                        role="link"
                        aria-label={`View ${crypto.name} on CoinMarketCap`}
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view on CoinMarketCap</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};