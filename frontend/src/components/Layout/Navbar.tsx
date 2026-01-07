import type { JSX } from "react";
import { Link } from "react-router-dom";

export const Navbar = (): JSX.Element => {
    return (
        <nav className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo Section */}
                <div className="flex items-center gap-1">
                    <div
                        className="rounded-xl"
                        style={{
                            backgroundImage: "url('/payxlogo.png')",
                            width: "40px",  // Made square to match the icon look
                            height: "40px",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        PayX
                    </span> 
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-8">
                    <Link 
                        to={"/login"}
                        className="text-base font-medium text-gray-600 transition-colors hover:text-indigo-600"
                    >
                        Login
                    </Link>
                    <Link 
                        to={"/signup"}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
        
    );
}