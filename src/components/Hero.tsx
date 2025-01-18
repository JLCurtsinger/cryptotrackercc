import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  const scrollToBestBet = () => {
    const bestBetSection = document.getElementById('best-bet-section');
    if (bestBetSection) {
      bestBetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-gradient min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Track Crypto. Find Trends. Maximize Profits.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover profitable cryptocurrency trends with real-time analysis and advanced metrics.
          Make informed decisions with our comprehensive tracking system.
        </p>
        <Button className="group button-glow" size="lg" onClick={scrollToBestBet}>
          Current Best Bet
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};