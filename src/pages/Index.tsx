import { About } from "@/components/About";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { BestBet } from "@/components/BestBet";
import { CryptoTable } from "@/components/CryptoTable";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { getApiKey } from "@/services/api";

const Index = () => {
  const hasApiKey = !!getApiKey();

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto px-4 py-12 space-y-12">
        {!hasApiKey && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Enter Your API Key</h2>
            <ApiKeyInput />
          </section>
        )}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Top Cryptocurrencies</h2>
          <CryptoTable />
        </section>
        <section className="grid md:grid-cols-2 gap-8">
          <BestBet />
          <About />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;