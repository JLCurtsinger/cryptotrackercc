import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { getApiKey, setApiKey } from "@/services/api";
import { toast } from "sonner";

export const ApiKeyInput = () => {
  const [key, setKey] = useState(getApiKey() || "");

  const handleSave = () => {
    if (!key.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    setApiKey(key.trim());
    toast.success("API key saved successfully");
  };

  return (
    <div className="flex gap-4 items-center max-w-md mx-auto mb-8">
      <Input
        type="password"
        placeholder="Enter your CoinMarketCap API key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <Button onClick={handleSave} className="button-glow">Save Key</Button>
    </div>
  );
};