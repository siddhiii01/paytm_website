import {useForm} from "react-hook-form";
import { api } from "../../utils/axios";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import type {JSX} from "react";
import {toast} from "react-hot-toast";

//ALLOWED BANKS 
const PROVIDERS = ["HDFC", "AXIS", "SBI"] as const;

//VALIDATION RULES 
const moneySchema = z.object({
    amount : z
            .number()
            .min(1, "Amount must be at least Rs.1")
            .max(20000, "Amount cannot exceed Rs.20,000")
            .positive("Amount must be positive"),
    provider: z.enum(PROVIDERS),
});

//Infering type from schema
type MoneyFormData = z.infer<typeof moneySchema>;

export const AddMoneyToWallet = (): JSX.Element => {

    // useForm setup with zod validation
    const {
        register, 
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<MoneyFormData>({
        resolver: zodResolver(moneySchema),
    });

    // Form submission handler
    const onSubmit = async (data: MoneyFormData) => {
        try {

            if (import.meta.env.DEV) {
                console.log("Submitting add money form:", data);
            }

            // Make POST request to backend
            // Endpoint: /addtowallet – same as Express route
            const response = await api.post("/addtowallet", data);
            const { success, paymentUrl } = response.data;
            if(success && paymentUrl){
                toast.success("Redirecting to bank...");
                // Small delay gives user time to see success toast
                setTimeout(() => {
                    // Important: full page navigation (not react-router navigate)
                    // because we're leaving the app to go to external bank page
                    window.location.href = paymentUrl;
                }, 800); 
                reset(); // clear form after success
            } else {
                toast.error("Failed to initiate payment – no payment URL received");
            } 
        } catch(error: any){
            console.error("Add money failed:", error);
            // Better error message extraction
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again later.";

            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto pt-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Add Money to Wallet</h1>
                    <p className="text-sm text-gray-500 mt-1">Transfer funds securely from your bank account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Bank Selection */}
                        <div>
                            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Bank
                            </label>
                            <select 
                                {...register("provider")} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
                            >
                                <option value="">-- Choose your bank --</option>
                                <option value="HDFC">HDFC Bank</option>
                                <option value="AXIS">Axis Bank</option>
                                <option value="SBI">State Bank of India</option>
                            </select>
                            {errors.provider && (
                                <p className="text-red-600 text-xs mt-2">
                                    {errors.provider.message}
                                </p>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Amount 
                            </label>
                            <input 
                                type="number"
                                step="1"
                                placeholder="Enter amount"
                                {...register("amount", {
                                    valueAsNumber: true
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                            />
                            {errors.amount && (
                                <p className="text-red-600 text-xs mt-2">{errors.amount.message as string}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Add Money
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}