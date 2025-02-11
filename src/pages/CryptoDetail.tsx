import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoDetail } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Globe, FileText, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoChart } from "@/components/CryptoChart";
import { toast } from "sonner";

const CryptoDetail = () => {
  const { symbol } = useParams();
  
  const { data: crypto, isLoading, isError, error } = useQuery({
    queryKey: ["crypto", symbol],
    queryFn: () => fetchCryptoDetail(symbol as string),
    enabled: !!symbol,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isError) {
    console.error("Error fetching crypto details:", error);
    toast.error("Failed to load cryptocurrency data. Please try again later.");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Failed to load cryptocurrency data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : crypto ? (
        <>
          <div className="flex items-center gap-4">
            <img
              src={crypto.logo}
              alt={`${crypto.name} logo`}
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div>
              <h1 className="text-3xl font-bold">
                {crypto.name} ({crypto.symbol})
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">
                  ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center gap-1 ${crypto.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.change > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(crypto.change).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-semibold">${crypto.marketCap.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                    <div className="font-semibold">${crypto.volume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Circulating Supply</div>
                    <div className="font-semibold">
                      {crypto.circulatingSupply?.toLocaleString()} {crypto.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Max Supply</div>
                    <div className="font-semibold">
                      {crypto.maxSupply?.toLocaleString() || 'N/A'} {crypto.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Market Cap Change (24h)</div>
                    <div className="font-semibold">
                      {crypto.marketCapChange24h?.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Volume/Market Cap</div>
                    <div className="font-semibold">
                      {crypto.volumeMarketCapRatio?.toFixed(4)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {crypto.website && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(crypto.website, '_blank')}
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                )}
                {crypto.whitepaper && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(crypto.whitepaper, '_blank')}
                  >
                    <FileText className="h-4 w-4" />
                    Whitepaper
                  </Button>
                )}
                {crypto.github && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(crypto.github, '_blank')}
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                )}
                {crypto.twitter && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open(crypto.twitter, '_blank')}
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <CryptoChart symbol={symbol as string} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default CryptoDetail;