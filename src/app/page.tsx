import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { Leaf, Lock, ShieldCheck, Database, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 selection:bg-green-100 selection:text-green-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-100 shadow-xl shadow-green-100/50">
          <Leaf className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-4">
          Green-<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">Data</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-medium text-gray-600 max-w-2xl mb-2">
          Streamline your inbox and contribute to a greener planet.
        </p>

        <p className="mt-2 text-lg text-gray-500 max-w-xl mb-10">
          Green-Data helps you declutter your Gmail, freeing up digital space and reducing your carbon footprint to combat climate change.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md items-center mt-6">
          <LoginButton />
          <Link href="/dashboard" className="w-full sm:w-auto px-6 py-4 rounded-full font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
            <PlayCircle className="w-5 h-5 text-green-600" />
            Try Demo Dashboard
          </Link>
        </div>

        {/* Security Transparency */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-16">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Bank-Level Security & Privacy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-xs font-bold text-gray-700">Google OAuth 2.0 Secure Authentication</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <Database className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-xs font-bold text-gray-700">We only read structural metadata.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <Lock className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-xs font-bold text-gray-700">We NEVER read or store email content.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <Leaf className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-xs font-bold text-gray-700">Access can be safely revoked at anytime.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full h-24 border-t border-gray-200 flex items-center justify-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} Green-Data. All rights reserved. Built for sustainability.
      </footer>
    </div>
  );
}
