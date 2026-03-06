"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Cloud, HardDrive, BatteryCharging, Loader2 } from "lucide-react";

export default function EcoDataPage() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
    const [history, setHistory] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const data = JSON.parse(localStorage.getItem("dataLeafHistory") || "[]");
            setHistory(data);
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }, []);

    if (!isMounted) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    const totalCo2 = history.reduce((acc, curr) => acc + (curr.co2SavedG || 0), 0);
    const totalStorageMB = history.reduce((acc, curr) => acc + (curr.storageFreedMB || 0), 0);
    const totalEnergyKwh = (totalStorageMB * 0.0003).toFixed(4);

    const co2Display = totalCo2 >= 1000 ? `${(totalCo2 / 1000).toFixed(2)} kg` : `${totalCo2.toFixed(1)} g`;
    const storageDisplay = totalStorageMB >= 1024 ? `${(totalStorageMB / 1024).toFixed(2)} GB` : `${totalStorageMB.toFixed(1)} MB`;

    const drivingKm = (totalCo2 / 250).toFixed(1); // Rough estimate: 250g CO2 per km
    const laptopH = (Number(totalEnergyKwh) * 20).toFixed(1); // 20h per kWh approx

    const getChartData = (days: number) => {
        const dataMap: Record<string, { co2: number, storage: number }> = {};
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const name = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            dataMap[name] = { co2: 0, storage: 0 };
        }

        history.forEach(item => {
            const d = new Date(item.date);
            const name = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (dataMap[name]) {
                dataMap[name].co2 += item.co2SavedG;
                dataMap[name].storage += item.storageFreedMB;
            }
        });

        return Object.keys(dataMap).map(key => ({
            name: key,
            co2: Number(dataMap[key].co2.toFixed(2)),
            storage: Number(dataMap[key].storage.toFixed(2))
        }));
    };

    const chartData = timeRange === "7d" ? getChartData(7) : getChartData(30);

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Eco Data</h1>
                    <p className="text-gray-500 mt-2 text-lg">Visualize your environmental impact and digital savings.</p>
                </div>

                <div className="bg-white rounded-xl p-1.5 border border-gray-200 flex text-sm font-bold shadow-sm">
                    <button
                        onClick={() => setTimeRange("7d")}
                        className={`px-5 py-2 rounded-lg transition-colors ${timeRange === "7d" ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Last 7 days
                    </button>
                    <button
                        onClick={() => setTimeRange("30d")}
                        className={`px-5 py-2 rounded-lg transition-colors ${timeRange === "30d" ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Last 30 days
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-3xl p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Cloud className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-green-50 tracking-wide uppercase">Total CO₂ Saved</h3>
                    </div>
                    <div className="text-5xl font-black relative z-10 flex items-baseline gap-2">{co2Display}</div>
                    <p className="mt-4 text-green-100 font-medium relative z-10 opacity-90">Equivalent to driving {drivingKm} km</p>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <HardDrive className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-blue-50 tracking-wide uppercase">Total Data Saved</h3>
                    </div>
                    <div className="text-5xl font-black relative z-10 flex items-baseline gap-2">{storageDisplay}</div>
                    <p className="mt-4 text-blue-100 font-medium relative z-10 opacity-90">Of server space freed up permanently</p>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <BatteryCharging className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-orange-50 tracking-wide uppercase">Energy Saved</h3>
                    </div>
                    <div className="text-5xl font-black relative z-10 flex items-baseline gap-2">{totalEnergyKwh} <span className="text-2xl font-bold opacity-80">kWh</span></div>
                    <p className="mt-4 text-orange-100 font-medium relative z-10 opacity-90">Enough to power a laptop for {laptopH}h</p>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
            </div>

            {/* Graph Area */}
            <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 border-b border-gray-100 pb-4">Savings Timeline Analysis</h2>
                <div className="h-96 w-full">
                    {history.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 'bold' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 'bold' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 20px', fontWeight: 'bold' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="co2" name="CO₂ Saved (g)" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorCo2)" />
                                <Area type="monotone" dataKey="storage" name="Storage Freed (MB)" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorStorage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Cloud className="w-16 h-16 opacity-20 mb-4" />
                            <p className="font-medium text-lg">No data available yet</p>
                            <p className="text-sm opacity-80 mt-1">Run an inbox scan to generate your timeline.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
