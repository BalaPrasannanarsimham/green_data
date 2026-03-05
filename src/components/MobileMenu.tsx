"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-gray-900 tracking-tight">Data Leaf</span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-gray-900/50" onClick={() => setIsOpen(false)} />
                    <div className="relative flex w-64 max-w-sm flex-col bg-white h-full animate-in slide-in-from-left-full duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg z-50"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div onClick={() => setIsOpen(false)} className="h-full">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
