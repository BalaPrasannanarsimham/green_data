import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { ShieldCheck, Database, Lock, PlayCircle, Leaf } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden relative" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <style>{`
        @keyframes zoom {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .anim-zoom {
          animation: zoom 2s ease;
        }
        .anim-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
        .anim-fade-3 {
          animation: fadeSlow 3s ease;
        }
        .anim-fade-6 {
          animation: fadeSlow 6s ease;
        }
      `}</style>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center z-10 py-10">

        {/* Animated the user's HTML intro */}
        <div className="container text-center flex flex-col items-center">

          <div className="relative anim-zoom flex flex-col items-center justify-center">
            <div id="fallback-emojis" className="flex items-center gap-4">
              <div className="text-[100px] leading-none">🌿</div>
              <div className="text-[70px] leading-none anim-spin-slow mt-4">♻️</div>
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold mt-6 bg-gradient-to-r from-[#2ecc71] to-[#3498db] bg-clip-text text-transparent anim-fade-3 tracking-widest uppercase">
            Data Leaf
          </h1>

          <div className="text-[28px] text-[#ff7a18] mt-4 anim-fade-6 font-semibold">
            Using n8n Automation
          </div>
        </div>

        <p className="mt-8 text-lg text-slate-400 max-w-xl mb-12 anim-fade-6">
          Data Leaf helps you declutter your Gmail, freeing up digital space and reducing your carbon footprint to combat climate change.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md items-center anim-fade-6">
          <LoginButton />
          <Link href="/dashboard" className="w-full sm:w-auto px-6 py-4 rounded-full font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
            <PlayCircle className="w-5 h-5 text-[#2ecc71]" />
            Try Demo Dashboard
          </Link>
        </div>

        {/* Security Transparency in Dark Mode */}
        <div className="mt-24 max-w-4xl border-t border-slate-800 pt-16 anim-fade-6 w-full">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 text-center">Bank-Level Security & Privacy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-[#2ecc71] mb-3" />
              <p className="text-xs font-bold text-slate-300">Google OAuth 2.0 Secure Authentication</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col items-center text-center">
              <Database className="w-8 h-8 text-[#2ecc71] mb-3" />
              <p className="text-xs font-bold text-slate-300">We only read structural metadata.</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col items-center text-center">
              <Lock className="w-8 h-8 text-[#2ecc71] mb-3" />
              <p className="text-xs font-bold text-slate-300">We NEVER read or store email content.</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col items-center text-center">
              <Leaf className="w-8 h-8 text-[#2ecc71] mb-3" />
              <p className="text-xs font-bold text-slate-300">Access can be safely revoked at anytime.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full h-24 border-t border-slate-800 flex items-center justify-center text-slate-600 text-sm mt-10 z-10 w-full">
        &copy; {new Date().getFullYear()} DATA LEAF. All rights reserved. Built for sustainability.
      </footer>
    </div>
  );
}
