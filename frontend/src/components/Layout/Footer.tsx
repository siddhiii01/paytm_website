import type { JSX } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";

export const Footer = (): JSX.Element => {
    return (
        <footer className="bg-slate-50 border-t border-gray-100 pt-10 pb-6">
            <div className="mx-auto max-w-7xl px-8">
                {/* Main content grid with reduced bottom margin */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="rounded-lg"
                                style={{
                                    backgroundImage: "url('/payxlogo.png')",
                                    width: "32px",
                                    height: "32px",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
                            <span className="text-lg font-bold text-slate-900">PayX</span>
                        </div>
                        <p className="max-w-xs text-slate-500 text-sm leading-snug mb-4">
                            Simple, secure digital wallet for fast and reliable money 
                            transfers. Built with modern security standards.
                        </p>
                    </div>

                    {/* Company Links  */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 text-sm">Company</h4>
                        <div className="flex flex-col gap-2">
                            <Link to={"/"} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">About</Link>
                            <Link to={"/"} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Security</Link>
                            <Link to={"/"} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Legal Links*/}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 text-sm">Legal</h4>
                        <div className="flex flex-col gap-2">
                            <Link to={"/"} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Privacy Policy</Link>
                            <Link to={"/"} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar  */}
                <div className="border-t border-gray-200 pt-6 text-center">
                    <p className="text-slate-400 text-[12px]">
                        © {new Date().getFullYear()} PayX. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};