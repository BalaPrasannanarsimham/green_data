"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export function LoginButton() {
    return (
        <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white transition-all bg-green-600 rounded-full hover:bg-green-700 hover:scale-105 shadow-xl shadow-green-600/20 active:scale-95 whitespace-nowrap"
        >
            <LogIn className="w-5 h-5" />
            Get Started with Google
        </button>
    );
}
