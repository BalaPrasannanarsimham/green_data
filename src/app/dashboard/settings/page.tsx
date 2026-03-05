import { User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-2 text-lg">Manage your Data Leaf account preferences and powerful integrations.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col lg:flex-row">

                {/* Sidebar settings nav */}
                <div className="w-full lg:w-72 bg-gray-50/50 p-6 lg:p-8 space-y-2 border-b lg:border-b-0 lg:border-r border-gray-100">
                    <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold rounded-2xl text-green-700 bg-green-50 shadow-sm border border-green-100 transition-all">
                        <div className="flex items-center gap-4"><User className="w-5 h-5" /> Profile Settings</div>
                    </button>
                    <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold rounded-2xl text-gray-600 hover:bg-gray-100/80 transition-all border border-transparent">
                        <div className="flex items-center gap-4"><Bell className="w-5 h-5" /> Notifications</div>
                    </button>
                    <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold rounded-2xl text-gray-600 hover:bg-gray-100/80 transition-all border border-transparent">
                        <div className="flex items-center gap-4"><Shield className="w-5 h-5" /> Data & Privacy</div>
                    </button>
                </div>

                {/* Content area */}
                <div className="flex-1 p-8 lg:p-12 space-y-10">

                    <div className="animate-in fade-in duration-700">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Connected Accounts</h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border border-gray-200 rounded-3xl shadow-sm gap-4">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner border border-blue-100">
                                    G
                                </div>
                                <div>
                                    <p className="font-extrabold text-gray-900 flex items-center gap-2">Google Sync <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">Active</span></p>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">Read & Write Access to Gmail provided.</p>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto px-6 py-3 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 transition shadow-sm bg-white">
                                Manage Access
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="animate-in fade-in duration-700 delay-100">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                            n8n Integration
                            <span className="bg-purple-100 text-purple-700 text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full">Pro</span>
                        </h2>
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">Webhook Target URL</label>
                            <input
                                type="text"
                                defaultValue="https://n8n.your-domain.com/webhook/cleanup"
                                className="w-full h-14 px-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-gray-50 font-medium text-gray-900 shadow-inner transition outline-none"
                            />
                            <p className="text-sm text-gray-500 font-medium ml-1">
                                This URL will be contacted securely whenever an automated cleanup task is triggered.
                            </p>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black hover:-translate-y-0.5 transition-all shadow-xl shadow-gray-900/20 active:scale-95">
                                Save Integration
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                                Test Connection
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
