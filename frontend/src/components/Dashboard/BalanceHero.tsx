import { Wallet } from "lucide-react";
import type { JSX } from "react";

export const BalanceHero = ():JSX.Element => {
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-1">Hello, name</h1>
            <p className="text-gray-400 mb-6">Welcome back to PayX</p>
            
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                        <Wallet size={40} className="bg-white/20 p-2 rounded-md"/>
                        <div>
                            <p className="opacity-70 font-bold text-xl">Wallet Balance</p>
                            <span className="opacity-70 text-xs">Available to spend</span>
                        </div>
                    </div>

                    <div className="text-3xl font-bold mb-1 mt-4">Rs. Balance</div>
                    <p className="text-sm opacity-80">Indian rupees</p>
                </div>

            </div>
       
    )

}