"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Home,
    Trash2,
    BarChart2,
    History,
    Lightbulb,
    Crown,
    Settings,
    LogOut,
    Leaf,
    Mail
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Inbox Scan", href: "/dashboard/clean", icon: Trash2 },
        { name: "Carbon Impact", href: "/dashboard/eco-data", icon: BarChart2 },
        { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Upgrade", href: "/dashboard/upgrade", icon: Crown },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">Data Leaf</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    const isReallyActive = link.href === "/dashboard" ? pathname === "/dashboard" : isActive;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isReallyActive
                                ? "bg-green-50 text-green-700 shadow-sm border border-green-100"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isReallyActive ? "text-green-600" : "text-gray-400"}`} />
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm">
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-green-600" />
                        </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate font-bold text-gray-900" title={session?.user?.name || ""}>
                            {session?.user?.name || "User"}
                        </span>
                        <span className="truncate text-xs text-gray-500" title={session?.user?.email || ""}>
                            {session?.user?.email}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-transparent transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
