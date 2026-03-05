"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
            <LogOut className="w-4 h-4" />
            Sign out
        </button>
    );
}
