"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2, CheckCircle, AlertTriangle, Leaf, HardDrive, Inbox } from "lucide-react";

export default function AnalyzePage() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState("");
    const [isCleaning, setIsCleaning] = useState(false);
    const [cleaned, setCleaned] = useState(false);

    useEffect(() => {
        // Start analysis on mount
        fetch("/api/gmail/analyze")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to authenticate or fetch data. Please re-login.");
                }
                return res.json();
            })
            .then((data) => {
                setStats(data);
                setIsAnalyzing(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not analyze your inbox. Have you granted Gmail permissions?");
                setIsAnalyzing(false);
            });
    }, []);

    const handleCleanup = async () => {
        if (!stats || !stats.messages || stats.messages.length === 0) return;

        setIsCleaning(true);
        try {
            const res = await fetch("/api/gmail/cleanup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messagesIds: stats.messages }),
            });

            if (!res.ok) throw new Error("Cleanup failed");

            setCleaned(true);
        } catch (err: any) {
            console.error(err);
            setError("An error occurred while cleaning your inbox.");
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
            <div className="w-full max-w-3xl">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-12 overflow-hidden relative">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Inbox Analysis</h1>
                        <p className="text-gray-500">Scanning for promotional & outdated emails to reduce your digital footprint.</p>
                    </div>

                    {/* State: Analyzing */}
                    {isAnalyzing && !error && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <Loader2 className="w-16 h-16 text-green-600 animate-spin relative z-10" />
                            </div>
                            <p className="text-lg font-medium text-gray-700 animate-pulse">Scanning thousands of emails...</p>
                        </div>
                    )}

                    {/* State: Error */}
                    {!isAnalyzing && error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
                            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* State: Results / Ready to Clean */}
                    {!isAnalyzing && !error && stats && !cleaned && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-center">
                                <h2 className="text-xl font-bold text-green-900 mb-1">Found {stats.count} unnecessary emails</h2>
                                <p className="text-green-700 text-sm">Mostly promotions and newsletters older than 1 month.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white border text-center border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
                                    <HardDrive className="w-8 h-8 text-blue-500 mb-3" />
                                    <div className="text-2xl font-black text-gray-900">{stats.estimatedSizeMB} <span className="text-sm font-medium text-gray-500">MB</span></div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">Storage Space</div>
                                </div>
                                <div className="bg-white border text-center border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                        <Leaf className="w-16 h-16 text-green-500" />
                                    </div>
                                    <Leaf className="w-8 h-8 text-green-500 mb-3 relative z-10" />
                                    <div className="text-2xl font-black text-green-600 relative z-10">{stats.co2SavedGrams} <span className="text-sm font-medium opacity-80">g CO₂e</span></div>
                                    <div className="text-xs text-green-800 uppercase tracking-widest mt-1 font-semibold relative z-10">Est. Carbon Offset</div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <p className="text-sm text-gray-500 max-w-sm text-center sm:text-left">
                                    By cleaning these emails, you will immediately free up server space and lower your carbon emissions permanently.
                                </p>
                                <button
                                    onClick={handleCleanup}
                                    disabled={isCleaning || stats.count === 0}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-white font-bold bg-green-600 rounded-full hover:bg-green-700 transition shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCleaning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Cleaning...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Clean {stats.count} Emails
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State: Cleaned */}
                    {cleaned && stats && (
                        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-500">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-60"></div>
                                <CheckCircle className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Inbox Cleaned!</h2>
                            <p className="text-gray-600 mb-8 max-w-md">
                                You have successfully deleted <strong>{stats.count}</strong> emails, freeing up <strong>{stats.estimatedSizeMB} MB</strong> of space and offsetting <strong>{stats.co2SavedGrams}g</strong> of carbon.
                            </p>

                            <button
                                onClick={() => router.push("/dashboard")}
                                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all hover:scale-105 active:scale-95"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
