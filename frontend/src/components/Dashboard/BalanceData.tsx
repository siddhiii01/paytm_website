import { Wallet, IndianRupee } from "lucide-react";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import { api } from "../../utils/axios";

type BalanceData = {
  available: number;
  locked: number;
  currency: string;
};

export const BalanceData = (): JSX.Element => {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("/api/balance");
        console.log("Balance fetched:", response.data);
        setBalance(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch balance:", err);
        setError("Could not load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-md"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 bg-white/30 rounded"></div>
            <div className="h-3 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="h-10 w-48 bg-white/30 rounded mb-2"></div>
        <div className="h-4 w-32 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg text-white text-center">
        <p>{error || "Balance not available"}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg overflow-hidden">
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/20 p-2 rounded-md">
          <Wallet size={32} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-xl">Wallet Balance</p>
          <span className="text-xs opacity-80">Available to spend</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-4xl md:text-5xl font-bold mb-1 tracking-tight flex items-center gap-2">
            <IndianRupee className="h-9 w-9 md:h-11 md:w-11 text-white/90" />
            <span>{balance.available.toFixed(2)}</span>
        </div>

      {/* Currency note */}
      <p className="text-sm opacity-80">Indian rupees</p>
    </div>
  );
};