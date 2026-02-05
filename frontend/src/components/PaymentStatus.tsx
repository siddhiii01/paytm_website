import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, ArrowRight, Download, Receipt } from "lucide-react"; // ← install lucide-react if not already

export const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const token = searchParams.get("token") || "—";

  const isSuccess = status === "Success";
  const isFailed = status === "Failed";

  // Fake order details (in real app → fetch from backend using token)
  const orderDetails = {
    orderId: `WX${Math.floor(100000000 + Math.random() * 900000000)}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    amount: "₹200", // ← in real app: fetch from backend
    method: "UPI • Google Pay",
    statusText: isSuccess ? "Successful" : "Failed",
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment completed successfully!", { duration: 4000 });
    } else if (isFailed) {
      toast.error("Payment could not be processed", { duration: 5000 });
    } else {
      toast.error("Invalid payment response", { duration: 5000 });
    }

    // Optional: auto-redirect after 8 seconds (longer so user can read)
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 8000);

    return () => clearTimeout(timer);
  }, [isSuccess, isFailed, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header / Status Icon */}
        <div
          className={`p-8 text-center ${
            isSuccess
              ? "bg-gradient-to-br from-green-50 to-green-100"
              : "bg-gradient-to-br from-red-50 to-red-100"
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : isFailed ? (
              <XCircle className="w-12 h-12 text-red-500" />
            ) : (
              <XCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Payment {orderDetails.statusText}
          </h1>
          <p className="text-gray-600 mt-1">Order ID: {orderDetails.orderId}</p>
        </div>

        {/* Details Card */}
        <div className="p-6 space-y-5">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {orderDetails.date} • {orderDetails.time}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-lg">{orderDetails.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{orderDetails.method}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span
                className={`font-semibold ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {orderDetails.statusText}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => alert("Download receipt feature coming soon!")}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              <Download size={18} />
              Download Receipt
            </button>
          </div>

          {/* Extra actions / support */}
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