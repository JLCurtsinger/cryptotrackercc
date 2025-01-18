import { About } from "@/components/About";
import { BackToTop } from "@/components/BackToTop";
import { BestBet } from "@/components/BestBet";
import { CryptoTable } from "@/components/CryptoTable";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto px-4 py-12 space-y-12">
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
      <BackToTop />
    </div>
  );
};

export default Index;