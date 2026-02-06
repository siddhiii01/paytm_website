import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, ArrowRight, Download } from "lucide-react";
import { api } from "../utils/axios";

type TransactionDetail = {
  type: "onramp" | "p2p";
  amount: number;
  date: string;
  method: string;
  statusText: "Successful" | "Failed";
  counterparty?: string;
  direction?: "sent" | "received";
};

export const PaymentStatus = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get("/api/transaction/latest");
        const tx = res.data.data;

        if (!tx) {
          setError("No recent transaction found");
          return;
        }

        setDetails(tx);

        // Show toast
        if (tx.statusText === "Successful") {
          toast.success(
            tx.type === "onramp"
              ? "Money added to wallet successfully!"
              : "Money sent successfully!",
            { duration: 4000 }
          );
        } else {
          toast.error("Transaction failed", { duration: 5000 });
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load transaction");
        toast.error("Could not load details", { duration: 5000 });
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();

    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => navigate("/dashboard"), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recent transaction...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">{error || "No recent transaction found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isSuccess = details.statusText === "Successful";
  const isOnRamp = details.type === "onramp";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div
          className={`p-8 text-center ${
            isSuccess ? "bg-gradient-to-br from-green-50 to-green-100" : "bg-gradient-to-br from-red-50 to-red-100"
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            {isOnRamp ? "Added to Wallet" : "Money Sent"}{" "}
            {details.statusText}
          </h1>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{details.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-lg">
                ₹{details.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Method</span>
              <span className="font-medium">{details.method}</span>
            </div>

            {details.counterparty && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {details.direction === "sent" ? "To" : "From"}
                </span>
                <span className="font-medium">{details.counterparty}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span
                className={`font-semibold ${isSuccess ? "text-green-600" : "text-red-600"}`}
              >
                {details.statusText}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => toast("Receipt download coming soon!")}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              <Download size={18} />
              Download Receipt
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 border-t">
          © PayX • Secure Payments • Maharashtra, India
        </div>
      </div>
    </div>
  );
};