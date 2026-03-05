"use client";

import { useEffect, useState } from "react";
import { HardDrive, CloudRain, Zap, Inbox, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/stats")
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.details || data.error || "Could not fetch real-time stats");
                }
                return data;
            })
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Dashboard Fetch Error:", err);
                setError(`Failed to fetch data: ${err.message}. If this is a permission error, please re-login to grant Google Drive scopes.`);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-green-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-bold tracking-wide">Fetching real-time Google Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-lg">Error Loading Stats</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 mt-2 text-lg">Here is an overview of your real digital carbon footprint.</p>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 text-white shadow-xl shadow-green-600/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md flex-shrink-0 relative z-10">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    <h3 className="font-extrabold text-2xl mb-2">Make an Impact</h3>
                    <p className="text-green-50 text-base font-medium opacity-90 leading-relaxed md:max-w-2xl">
                        "Every megabyte of data takes energy to store. Clean your inbox and help save the planet, one email at a time."
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">Current Actual Footprint</h2>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* Google Drive Storage */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><HardDrive className="w-6 h-6" /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Drive Storage</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-900 flex items-baseline gap-2">{stats.storage?.usageGB || 0} <span className="text-xl font-bold text-gray-400">GB</span></div>
                        <div className="mt-2 text-sm text-gray-500 font-medium">of {stats.storage?.limitGB || 15} GB total</div>
                    </div>
                    <div className="mt-6 w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.storage?.usagePercent || 0}%` }} />
                    </div>
                </div>

                {/* CO2 Emissions */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CloudRain className="w-6 h-6" /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Est. Emissions</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black text-gray-900 flex items-baseline gap-2">{stats.emissions?.co2kg || 0} <span className="text-xl font-bold text-gray-400">kg/yr</span></div>
                        <div className="mt-4 text-xs uppercase tracking-widest font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full inline-block">High potential to save</div>
                    </div>
                </div>

                {/* Energy Consumption */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Zap className="w-6 h-6" /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Energy Used</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-900 flex items-baseline gap-2">{stats.energy?.kwh || 0} <span className="text-xl font-bold text-gray-400">kWh</span></div>
                        <div className="mt-4 text-sm text-gray-500 font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" /> Equivalent per year
                        </div>
                    </div>
                </div>

                {/* Files/Emails Count */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Inbox className="w-6 h-6" /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Unwanted Promos</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-900">~{stats.unwantedMails?.count || 0}</div>
                        <div className="mt-4 text-xs uppercase tracking-widest font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full inline-block">Ready to Clean</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
