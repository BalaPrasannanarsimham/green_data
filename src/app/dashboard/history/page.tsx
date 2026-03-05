import { History, Trash2 } from "lucide-react";

export default function HistoryPage() {
    const historyData = [
        { id: 1, date: "2026-03-04 10:23 AM", category: "Promotions", mailsDeleted: 450, storageFreed: "120 MB", co2Offset: "36g" },
        { id: 2, date: "2026-03-02 02:15 PM", category: "Spam", mailsDeleted: 1200, storageFreed: "500 MB", co2Offset: "150g" },
        { id: 3, date: "2026-02-28 09:00 AM", category: "Social (Older > 1m)", mailsDeleted: 300, storageFreed: "90 MB", co2Offset: "27g" },
        { id: 4, date: "2026-02-20 04:45 PM", category: "Large Files (>5MB)", mailsDeleted: 15, storageFreed: "85 MB", co2Offset: "25g" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Activity History</h1>
                <p className="text-gray-500 mt-2 text-lg">A detailed log of all your previous cleanups and optimizations.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-extrabold text-xs uppercase tracking-widest">
                                <th className="py-5 px-8 whitespace-nowrap">Date & Time</th>
                                <th className="py-5 px-8">Filter Profile</th>
                                <th className="py-5 px-8">Mails Removed</th>
                                <th className="py-5 px-8">Storage Freed</th>
                                <th className="py-5 px-8">Est. CO₂ Offset</th>
                                <th className="py-5 px-8 opacity-0">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/80">
                            {historyData.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-5 px-8 text-gray-900 font-bold whitespace-nowrap">{record.date}</td>
                                    <td className="py-5 px-8">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100/80 border border-gray-200 text-gray-700 text-xs font-bold tracking-wide">
                                            {record.category}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-gray-900 font-black text-lg">{record.mailsDeleted}</td>
                                    <td className="py-5 px-8">
                                        <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg">{record.storageFreed}</span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg">{record.co2Offset}</span>
                                    </td>
                                    <td className="py-5 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {historyData.length === 0 && (
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
