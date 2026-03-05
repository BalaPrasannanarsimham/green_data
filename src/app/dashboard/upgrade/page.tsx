"use client";

import { Crown, Check } from "lucide-react";

export default function Upgrade() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Upgrade Your Plan</h1>
                <p className="text-gray-500 mt-2 text-lg">Unlock advanced automations, team metrics, and priority support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-10">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">Free</h3>
                    <div className="text-4xl font-black text-gray-900 mt-4 mb-6">$0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Scan 1000 emails</li>
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Manual cleanup</li>
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Basic reports</li>
                    </ul>
                    <button className="w-full py-3 rounded-xl font-bold text-green-700 bg-green-50" disabled>Current Plan</button>
                </div>

                {/* Pro Plan */}
                <div className="bg-green-600 p-8 rounded-3xl border border-green-600 shadow-xl shadow-green-600/20 flex flex-col relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border-4 border-white">MOST POPULAR</div>
                    <h3 className="text-xl font-bold text-white">Pro</h3>
                    <div className="text-4xl font-black text-white mt-4 mb-6">$5<span className="text-lg text-green-100 font-medium">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-green-50"><Check className="w-5 h-5 text-green-300" /> Unlimited scans</li>
                        <li className="flex items-center gap-3 text-sm text-green-50"><Check className="w-5 h-5 text-green-300" /> Auto cleanup</li>
                        <li className="flex items-center gap-3 text-sm text-green-50"><Check className="w-5 h-5 text-green-300" /> AI suggestions</li>
                        <li className="flex items-center gap-3 text-sm text-green-50"><Check className="w-5 h-5 text-green-300" /> Carbon reports</li>
                    </ul>
                    <button className="w-full py-3 rounded-xl font-bold text-green-700 bg-white hover:bg-green-50 transition-colors shadow-sm">Upgrade to Pro</button>
                </div>

                {/* Team Plan */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">Team</h3>
                    <div className="text-4xl font-black text-gray-900 mt-4 mb-6">$12<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Company inbox cleaning</li>
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Team impact dashboard</li>
                        <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Admin control</li>
                    </ul>
                    <button className="w-full py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors">Contact Sales</button>
                </div>
            </div>
        </div>
    );
}
