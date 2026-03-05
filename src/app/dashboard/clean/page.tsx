"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, CheckCircle, Filter, Loader2 } from "lucide-react";

export default function CleanPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [status, setStatus] = useState<"idle" | "cleaning" | "done" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [deletedCount, setDeletedCount] = useState(0);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    // Filter States (now checkboxes)
    const [categories, setCategories] = useState({
        primary: false,
        promotions: true,
        social: false,
        updates: false,
        spam: false
    });

    const [readStatus, setReadStatus] = useState({
        read: false,
        unread: false
    });

    // For sizes, keeping it simple with a single selected value via state strings for these 
    // while rendering them visually as checkboxes/tiles.
    const [sizeFilter, setSizeFilter] = useState("");
    const [schedule, setSchedule] = useState("now");

    const handleClean = async () => {
        if (schedule !== "now") {
            setShowPopup(true);
            return;
        }

        setPreviewLoading(true);
        try {
            const selectedCats = Object.entries(categories)
                .filter(([_, isChecked]) => isChecked)
                .map(([cat]) => cat);

            const res = await fetch("/api/gmail/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categories: selectedCats, readStatus, sizeFilter })
            });
            const data = await res.json();
            if (res.ok) {
                setPreviewData(data);
            }
        } catch (e) {
            console.error("Failed to load preview");
        }
        setPreviewLoading(false);
        setShowPopup(true);
    };

    const buildQuery = () => {
        const parts = [];

        // Categories
        const selectedCats = Object.entries(categories)
            .filter(([_, isChecked]) => isChecked)
            .map(([cat]) => {
                if (cat === "spam") return "in:spam";
                if (cat === "primary") return "category:primary";
                return `category:${cat}`;
            });

        if (selectedCats.length > 0) {
            parts.push(`(${selectedCats.join(" OR ")})`);
        }

        // Read Status
        if (readStatus.read && !readStatus.unread) parts.push("is:read");
        if (!readStatus.read && readStatus.unread) parts.push("is:unread");



        // Size
        if (sizeFilter) parts.push(sizeFilter);

        // Default catch-all if nothing selected so we don't accidentally delete the whole inbox
        if (parts.length === 0) {
            return "label:nothing-selected-fallback-protection";
        }

        return parts.join(" ");
    };

    const confirmClean = async () => {
        setStatus("cleaning");
        setErrorMsg("");
        setShowPopup(false);

        if (schedule !== "now") {
            setStatus("cleaning");
            setTimeout(() => {
                setStatus("done");
                setDeletedCount(-1);
            }, 1000);
            return;
        }

        const query = buildQuery();

        try {
            const res = await fetch("/api/gmail/cleanup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ q: query })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to clean emails.");
            }

            setDeletedCount(data.deletedCount || 0);
            setStatus("done");
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message);
            setStatus("error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Clean Inbox</h1>
                <p className="text-gray-500 mt-2 text-lg">Select exactly what to clean. Emails will be directly moved to the trash.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                    <div className="p-3 bg-white shadow-sm text-gray-700 rounded-xl">
                        <Filter className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Checkboxes Selection</h2>
                        <p className="text-sm text-gray-500">Construct your filter visually. Real-time API execution.</p>
                    </div>
                </div>

                <div className="p-8 space-y-10">

                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Email Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(categories).map(([key, val]) => (
                                <label key={key} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${val ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                    <input
                                        type="checkbox"
                                        checked={val}
                                        onChange={(e) => setCategories({ ...categories, [key]: e.target.checked })}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700 capitalize">{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Read Status */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Read Status (Optional)</h3>
                        <div className="flex gap-4">
                            {Object.entries(readStatus).map(([key, val]) => (
                                <label key={key} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all flex-1 ${val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="checkbox"
                                        checked={val}
                                        onChange={(e) => setReadStatus({ ...readStatus, [key]: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700 capitalize">{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Options */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Size Filter</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Any Size", val: "" },
                                { label: "> 1 MB", val: "larger:1m" },
                                { label: "> 5 MB", val: "larger:5m" },
                                { label: "> 10 MB", val: "larger:10m" },
                            ].map((opt) => (
                                <label key={opt.label} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${sizeFilter === opt.val ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                                    <input
                                        type="radio"
                                        name="sizeGrp"
                                        checked={sizeFilter === opt.val}
                                        onChange={() => setSizeFilter(opt.val)}
                                        className="w-5 h-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Automation Schedule */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Automation Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Clean Now", val: "now", sub: "Execute directly" },
                                { label: "Weekly Auto-Clean", val: "weekly", sub: "Setup n8n cron" },
                                { label: "Monthly Auto-Clean", val: "monthly", sub: "Setup n8n cron" },
                                { label: "Yearly Auto-Clean", val: "yearly", sub: "Setup n8n cron" },
                            ].map((opt) => (
                                <label key={opt.val} className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${schedule === opt.val ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="scheduleGrp"
                                            checked={schedule === opt.val}
                                            onChange={() => setSchedule(opt.val)}
                                            className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300"
                                        />
                                        <span className="font-bold text-gray-700">{opt.label}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-7">{opt.sub}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-medium text-gray-500 break-all bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex-1">
                        <strong>Active Query:</strong> <code className="text-green-700">{buildQuery()}</code>
                    </p>
                    <button
                        onClick={handleClean}
                        disabled={status === "cleaning" || previewLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20 whitespace-nowrap"
                    >
                        {status === "cleaning" || previewLoading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> {schedule === "now" ? (previewLoading ? "Scanning..." : "Executing...") : "Saving..."}</>
                        ) : (
                            <><Trash2 className="w-5 h-5" /> {schedule === "now" ? "Preview & Delete" : "Set Auto-Clean"}</>
                        )}

                    </button>
                </div>
            </div>

            {status === "error" && (
                <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-3xl font-bold">
                    {errorMsg}
                </div>
            )}

            {status === "done" && (
                <div className="flex items-center gap-5 p-6 rounded-3xl bg-green-50 border border-green-200 shadow-sm animate-in slide-in-from-bottom-5 duration-500 mt-8">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full flex-shrink-0">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        {deletedCount === -1 ? (
                            <>
                                <h3 className="text-xl font-bold text-green-900 mb-1">Automation Scheduled!</h3>
                                <p className="text-green-700 font-medium opacity-90">
                                    Your n8n automation has been successfully configured to run {schedule}.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-green-900 mb-1">Mails Moved to Trash Successfully!</h3>
                                <p className="text-green-700 font-medium opacity-90">
                                    Direct cleanup executed. {deletedCount} emails moved to trash! (n8n setup is done successfully)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="p-8 text-center sm:p-10">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{schedule === "now" ? "Confirm Deletion" : "Confirm Schedule"}</h3>
                            <p className="text-gray-500 mb-4 text-base leading-relaxed">
                                {schedule === "now" ? "You are about to execute the exact search query:" : `You are scheduling a ${schedule} execution for:`}
                            </p>
                            {schedule === "now" && previewData && previewData.total !== undefined ? (
                                <div className="text-left mb-8">
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <h4 className="font-bold text-gray-900 mb-4 text-center">We found ~{previewData.total} unnecessary emails.</h4>
                                        <ul className="space-y-3">
                                            {Object.entries(previewData.breakdown).map(([cat, count]: [string, any]) => (
                                                count > 0 && (
                                                    <li key={cat} className="flex justify-between text-sm">
                                                        <span className="capitalize text-gray-600 font-medium">{cat}</span>
                                                        <span className="font-bold text-gray-900">{count}</span>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono text-gray-800 break-words mb-8">
                                    {buildQuery()}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="flex-1 py-4 px-6 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmClean}
                                    className={`flex-1 py-4 px-6 rounded-full font-bold text-white transition-colors shadow-lg ${schedule === "now" ? "bg-red-600 hover:bg-red-700 shadow-red-600/30" : "bg-teal-600 hover:bg-teal-700 shadow-teal-600/30"}`}
                                >
                                    {schedule === "now" ? "Yes, Move to Trash" : "Yes, Schedule Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
