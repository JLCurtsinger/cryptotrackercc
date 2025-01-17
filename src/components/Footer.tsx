import { Separator } from "./ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-background py-12 mt-20">
      <div className="container mx-auto px-4">
        <Separator className="mb-8" />
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Disclaimer: The information provided on this website is for educational purposes only
            and should not be considered as financial advice. Cryptocurrency investments are volatile
            and high-risk. Always conduct your own research before making investment decisions.
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Crypto Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};