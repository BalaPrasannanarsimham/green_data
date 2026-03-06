"use client";

import { useEffect, useState } from "react";
import { HardDrive, CloudRain, Zap, Inbox, Sparkles, AlertCircle, Loader2, Trophy, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = () => {
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
    };

    useEffect(() => {
        loadStats();
        // Set up polling to automatically refresh stats and pie charts every 15 seconds
        // so any deletions in `dashboard/clean` rapidly sync across the UI.
        const interval = setInterval(() => {
            loadStats();
        }, 15000);

        return () => clearInterval(interval);
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

    let highestCategory = { name: "", exactCount: 0 };
    if (stats?.categoryBreakdown) {
        for (const cat of stats.categoryBreakdown) {
            if (cat.name === "Inbox") continue;
            if ((cat.exactCount || 0) > highestCategory.exactCount) {
                highestCategory = { name: cat.name, exactCount: cat.exactCount || 0 };
            }
        }
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

            {/* Eco Score System */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gray-50 border-4 border-green-500 shadow-inner">
                        <span className="text-2xl font-black text-gray-900">82</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Eco Score</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-gray-900">Level: <span className="text-green-600">🌿 Cleaner</span></span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">You are consistently reducing your carbon footprint!</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
                        <span className="text-xs font-bold text-gray-700">Inbox Cleaner</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <Star className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-xs font-bold text-gray-700">Zero Inbox Hero</span>
                    </div>
                </div>
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                {/* Carbon Saved Over Time */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Carbon Saved Over Time (kg CO₂)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: "Jan", saved: 0.5 },
                                { name: "Feb", saved: 0.8 },
                                { name: "Mar", saved: 1.2 },
                                { name: "Apr", saved: 1.8 }
                            ]}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="saved" fill="#16A34A" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Email Category Breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Email Category Breakdown (KB)</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    isAnimationActive={false} // Disable standard Recharts pie chart delay animation loops so updates feel instantaneous
                                    data={stats.categoryBreakdown || [
                                        { name: "Promotions", value: 4000 },
                                        { name: "Social", value: 3000 },
                                        { name: "Updates", value: 2000 },
                                        { name: "Inbox", value: 1000 }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#16A34A" />
                                    <Cell fill="#4ADE80" />
                                    <Cell fill="#9CA3AF" />
                                    <Cell fill="#D1D5DB" />
                                </Pie>
                                <Tooltip formatter={(value: any) => `${(value || 0).toLocaleString('en-US')} KB`} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Insights & Carbon Equivalents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
                <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">You have saved 2.4kg CO₂ 🌍</h3>
                    <p className="text-gray-600 mb-4">Deleting 1,000 emails saves ~4kg CO₂ annually. Your current savings are equivalent to:</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700">🚘 Driving a car for 8 km avoided</li>
                        <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700">🔋 Charging your smartphone 300 times</li>
                    </ul>
                </div>
                <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">AI Suggestion ✨</h3>
                    <p className="text-gray-600 mb-4">
                        {!stats?.categoryBreakdown ? "Analyzing your inbox..." :
                            (highestCategory.exactCount === 0 ? "Great job! Your inbox is highly optimized right now. Keep it up!" :
                                `You receive over ${highestCategory.exactCount} ${highestCategory.name.toLowerCase()} emails. Auto-cleaning your ${highestCategory.name} tab can significantly reduce your carbon footprint!`)
                        }
                    </p>
                    {highestCategory.exactCount > 0 && (
                        <button
                            onClick={() => window.location.href = `/dashboard/clean?category=${highestCategory.name.toLowerCase()}`}
                            className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl font-bold transition-colors">
                            Apply Auto-Clean Filter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
