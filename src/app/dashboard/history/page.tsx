"use client";

import { useEffect, useState } from "react";
import { History, Trash2, CloudLightning, HardDrive } from "lucide-react";

export default function HistoryPage() {
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

    if (!isMounted) return null;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Activity History</h1>
                <p className="text-gray-500 mt-2 text-lg">A detailed log of all your previous cleanups and optimizations.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-extrabold text-xs uppercase tracking-widest whitespace-nowrap">
                                <th className="py-5 px-8">Date & Time</th>
                                <th className="py-5 px-8">Mails Removed</th>
                                <th className="py-5 px-8">Storage Freed</th>
                                <th className="py-5 px-8">Est. CO₂ Offset</th>
                                <th className="py-5 px-8 opacity-0">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/80">
                            {history.map((record, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-5 px-8 text-gray-900 font-bold whitespace-nowrap">
                                        {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-5 px-8 text-gray-900 font-black text-lg">
                                        <div className="flex items-center gap-2">
                                            {record.emailsDeleted.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap break-words">
                                            {record.storageFreedMB.toFixed(2)} MB
                                        </span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg whitespace-nowrap break-words">
                                            {record.co2SavedG.toFixed(2)} g
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                const newHistory = history.filter((_, i) => i !== idx);
                                                setHistory(newHistory);
                                                localStorage.setItem("dataLeafHistory", JSON.stringify(newHistory));
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {history.length === 0 && (
                    <div className="py-24 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <History className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No History Yet</h3>
                        <p className="text-gray-500 max-w-sm mt-1 text-lg leading-relaxed">Run your first cleanup to start building your environmental impact timeline right here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
