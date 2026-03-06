"use client";

import { Lightbulb, CheckCircle, Mail, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Recommendations() {
    const router = useRouter();

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Recommendations</h1>
                <p className="text-gray-500 mt-2 text-lg">Smart suggestions to reduce your digital clutter and carbon footprint.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                    <div className="p-3 h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Heavy LinkedIn Traffic</h3>
                        <p className="text-sm text-gray-500 mt-1">You receive ~120 LinkedIn notification emails monthly. Suggestion: Unsubscribe or switch to push notifications to reduce inbox clutter.</p>
                        <button
                            onClick={() => router.push('/dashboard/clean?category=social')}
                            className="mt-4 bg-gray-100 font-bold text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                            Take Action
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                    <div className="p-3 h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Old Promotions</h3>
                        <p className="text-sm text-gray-500 mt-1">You have over 5,000 promotional emails older than 1 year. Set up a Monthly Auto-Clean schedule to remove these automatically.</p>
                        <button
                            onClick={() => router.push('/dashboard/clean?category=promotions')}
                            className="mt-4 bg-green-600 font-bold text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                            Setup Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
