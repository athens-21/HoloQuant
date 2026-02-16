import { DashboardHeader } from "@/components/DashboardHeader";
import { AssetExplorer } from "@/components/AssetExplorer";
import { MarketIntelligence } from "@/components/MarketIntelligence";
import { QuantLogic } from "@/components/QuantLogic";
import { useState } from "react";

const Index = () => {
  // State for selected symbol - shared between AssetExplorer and QuantLogic
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 lg:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-4rem)]">
          <AssetExplorer onSelectSymbol={setSelectedSymbol} selectedSymbol={selectedSymbol} />
          <MarketIntelligence selectedSymbol={selectedSymbol} />
          <QuantLogic selectedSymbol={selectedSymbol} />
        </div>
      </main>
    </div>
  );
};

export default Index;
